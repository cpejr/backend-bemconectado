const mongoose = require('mongoose');
const moment = require('moment');

const countSchema = new mongoose.Schema({
  id: { type: mongoose.ObjectId, ref: 'ongs' },
  count: Number
}, { _id: false })

const counterSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  ongs: [countSchema]
});

const Counter = mongoose.model('Counter', counterSchema);

function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

class CounterActions {

  static async registerCount(date, ongId) {
    try {
      //Verificar se já exite a semana
      ////Criar se não, inserir
      const week = await this.findWeekOrCreate(date, ongId);
      let index = week.ongs.findIndex((ong) => `${ong.id}` === ongId);

      if (!index || index >= 0) {
        week.ongs[index].count += 1;
      }
      else {
        week.ongs.push({ id: ongId, count: 1 });
      }

      return await this.updateWeek(week);
    } catch (err) {
      console.warn(err)
    }


  };

  static async updateWeek(week) {
    const filter = {
      _id: week._id,
    }

    try {
      const response = await Counter.findOneAndUpdate(
        filter,
        week,
      )
      return response;
    } catch (error) {
      return error;
    }
  };

  static async findWeekOrCreate(date) {
    const refDate = moment.utc(getMonday(date).toDateString());

    const filter = {
      date: refDate,
    }

    const setOnInsert = {
      date: refDate,
      ongs: [],
    }

    const options = {
      upsert: true,
      new: true,
    }

    try {
      const response = await Counter.findOneAndUpdate(
        filter,
        {
          $setOnInsert: setOnInsert
        },
        options
      )
      return response;
    } catch (error) {
      return error;
    }
  }

  static async incremntOng(date, ongId) {
    const refDate = moment.utc(getMonday(date).toDateString());

    const filter = {
      date: refDate,
      "ongs.id": ongId,
    }

    const update = {
      $inc: {
        "ongs.$.count": 1
      }
    }
    try {
      const response = await Counter.findOneAndUpdate(filter, update);
      return response;
    } catch (error) {
      return error;
    }
  }
}

module.exports = CounterActions
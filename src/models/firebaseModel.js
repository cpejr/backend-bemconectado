const firebase = require("firebase/app");
require("firebase/auth");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASEURL,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_APPID,
};
firebase.initializeApp(firebaseConfig);

module.exports = {
  async createNewOng(email, password) {
    try {
      const result = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      return result.user.uid;
    } catch (error) {
      console.warn(error);
    }
  },

  async createSession(email, password) {
    try {
      const result = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      return result.user.uid;
    } catch (error) {
      console.warn(error);
    }
  },

  async forgotPassword(email) {
    const reponse = await firebase.auth().sendPasswordResetEmail(email);
    return reponse;
  },

  async createNewOng(email, password) {
    try {
      const result = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      return result.user.uid;
    } catch (error) {
      const result = await firebase.auth().getUserByEmail(email);
      if (error.code === "auth/email-already-in-use") {
        console.log("Email already exists!");
        return result;
      } else {
        console.log(error);
        return result;
      }
    }
  },
};

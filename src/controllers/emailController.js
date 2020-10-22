const nodemailer = require('nodemailer');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  pool: true,
  auth: {
    user: `${process.env.EMAIL_USER}`,
    pass: `${process.env.EMAIL_PASS}`
  },
});

class Email {

  static sendEmail(data) {
    const config = {
      from: `${process.env.EMAIL_USER}`,
      ...data
    };
    return new Promise((resolve, reject) => {
      transporter.sendMail(config, (error, info) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        else {
          console.log(`Email enviado ${info.response}`);
          resolve(info);
        }
      })
    }).catch(err => {
      console.log("Falha no envio do email");
      console.warn(err);
    });;
  }

  static userWaitingForApproval(to, firstName) {
    const content = `Prezado(a) ${firstName},
    Você acabou de cadastrar na plataforma Bem Conectado. Aguarde a ativação do seu cadastro para que os usuários possam ver sua ONG.`;
    const subject = 'Bem Conectado: Aguardando ativação de cadastro';
    const emailContent = {
      to: to,
      subject: subject,
      text: content
    };
    return Email.sendEmail(emailContent);
  }

  static userApprovedEmail(to, firstName) {
    console.log('Cadastro de usuário aprovado');
    const content = `Prezado(a) ${firstName},
    Seu cadastro foi realizado e aprovado com sucesso. Agora sua ONG está visível ao público!`;
    const subject = 'Bem Conectado: Cadastro ativado com sucesso';
    const emailContent = {
      to: to,
      subject: subject,
      text: content
    };
    return Email.sendEmail(emailContent);
  }

  static userRejectedEmail(to, fullname) {
    console.log('Cadastro de usuário reprovado');
    const content = `Prezado(a) ${fullname},
    Seu cadastro foi reprovado. Entre em contato com este email para mais informações.`;
    const subject = 'Bem conectado: Cadastro reprovado';
    const emailContent = {
      to: to,
      subject: subject,
      text: content
    };
    return Email.sendEmail(emailContent);
  }

  static userAccountCreatedEmail(to, fullname, password) {
    console.log('Novo usuário criado');
    const subject = 'Bem conectado: Nova Funcionalidade!';
    const content = `
    Olá ${fullname}! \n
    A equipe do Bem Conectado vêm com uma funcionalidade novinha para a sua iniciativa! \n
    Agora, existe uma zona de administração na qual você poderá editar suas informações que são exibidas no sistema! \n
    Além disso, é possível analisar quantas vizualizações a sua iniciativa está tendo no sistema toda semana, mês ou ano. \n
    Venha conhecer essas funcionalidades! \n
    Para efetuar seu login no sistema, utilize este mesmo email de contato e a senha a seguir: ${password} \n
    Essa senha pode ser alterada no próprio sistema, ou clicando no botão esqueci minha senha. \n
    É só entrar na página https://bem-conectado.com/login e preencher com as suas informações de login. \n \n
    Atenciosamente, \n
    Equipe do Bem Conectado. \n
    `;

    const contentHtml = `
    <p>Olá ${fullname}!</p>
    <p>A equipe do Bem Conectado vêm com uma funcionalidade novinha para a sua iniciativa! </p>
    <p>Agora, existe uma zona de administração na qual você poderá editar suas informações que são exibidas no sistema! </p>
    <p>Além disso, é possível analisar quantas vizualizações a sua iniciativa está tendo no sistema toda semana, mês ou ano. </p>
    <p>Venha conhecer essas funcionalidades! </p>
    <p>Para efetuar seu login no sistema, utilize este mesmo email de contato e a senha a seguir: ${password} </p>
    <p>Essa senha pode ser alterada no próprio sistema, ou clicando no botão esqueci minha senha. </p>
    <p>É só entrar na página https://bem-conectado.com/login e preencher com as suas informações de login. </p>
    <p>Atenciosamente, </p>
    <p> Equipe do Bem Conectado. </p>
    <img src="cid:logo@cid" />
    `
    const emailContent = {
      to: to,
      subject: subject,
      text: content,
      html: contentHtml,
      attachments: [{
        filename: 'logo.png',
        path: path.join(__dirname, '../../public/images/logo.png'),
        cid: 'logo@cid'
      }]
    };
    console.log(emailContent)
    return Email.sendEmail(emailContent);
  }

}

module.exports = Email;

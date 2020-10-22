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

  static userApprovedEmail(to, firstName, password) {
    console.log('Cadastro de usuário aprovado');
    const content = `
    Olá ${firstName}, \n
    O processo de análise foi concluido e nossa equipe acaba de efetuar a aprovação da sua iniciativa. \n
    A partir de agora sua ONG está visível ao público na plataforma do Bem Conectado.\n

    Além disso, com sua iniciativa aprovada você terá acesso ao painél de administração \n
    Nele você poderá editar informações e ter acesso aos dados estatísticos de visita na página de sua iniciativa.\n

    Para ver o painel acesse https://bem-conectado.com/login \n
    Dados de login: \n\n
    Email: ${to} \n
    Senha: ${password} (gerada automaticamente) \n
    
    Você poderá alterar a sua senha fazendo uso da funcionalidade "Esqueci minha senha" no painél de login.\n
    Aproveite! \n\n

    Atenciosamente, \n
    Equipe do Bem Conectado. \n
    `;

    const contentHtml = `
    <p>Olá ${firstName},</p>
    <p>O processo de análise foi concluido e nossa equipe acaba de efetuar a aprovação da sua iniciativa.</p>
    <p>A partir de agora sua ONG está visível ao público na plataforma do Bem Conectado.</p>
    <p></p>
    <p>Além disso, com sua iniciativa aprovada você terá acesso ao painél de administração</p>
    <p>Nele você poderá editar informações e ter acesso aos dados estatísticos de visita na página de sua iniciativa.</p>
    <p></p>
    <p>Para ver o painel acesse https://bem-conectado.com/login</p>
    <p>Dados de login:</p>
    <p>Email: ${to}</p>
    <p>Senha: ${password} (gerada automaticamente)</p>
    <p> </p>
    <p>Você poderá alterar a sua senha fazendo uso da funcionalidade "Esqueci minha senha" no painél de login.\n </p>
    <p>Aproveite!</p>
    <p></p>
    <p>Atenciosamente,</p>
    <p>Equipe do Bem Conectado.</p>
    <img src="cid:logo@cid" />
    `;
    const subject = 'Bem Conectado: Cadastro aprovado';
    const emailContent = {
      to: to,
      subject: subject,
      text: content,
      html: contentHtml,
      attachments: [{
        filename: 'logo300px.png',
        path: path.join(__dirname, '../../public/images/logo300px.png'),
        cid: 'logo@cid'
      }]
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
        filename: 'logo300px.png',
        path: path.join(__dirname, '../../public/images/logo300px.png'),
        cid: 'logo@cid'
      }]
    };
    console.log(emailContent)
    return Email.sendEmail(emailContent);
  }

}

module.exports = Email;

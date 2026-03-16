import nodemailer from 'nodemailer';
import { WelcomeMessageToProfessor } from './types/mail/welcomeMessageToProfessor';
import { WelcomeMessageToStudent } from './types/mail/welcomeMessageToStudent';

export class MailService {
  private static transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    }
  });

  static async sendWelcomeEmail(
    data : WelcomeMessageToProfessor | WelcomeMessageToStudent,
  ):Promise<void> {

    if (data.role === 'STUDENT') {
      const { name, to, password, ra } = data;

      const info = await this.transporter.sendMail({
        from: '"Sistema Escolar" <noreply@escola.com>',
        to: to,
        subject: "Bem-vindo! Seu acesso foi criado",
        html: `
          <h1>Olá, ${name}!</h1>
          <p>Seu cadastro no nosso sistema de agendamento acadêmico online como aluno foi realizado com sucesso.</p>
          <p><strong>Seus dados de acesso:</strong></p>
          <ul>
            <li><strong>RA (Registro Acadêmico):</strong> ${ra}</li>
            <li><strong>Senha Provisória:</strong> ${password}</li>
          </ul>
          <p>Acesse o link abaixo para fazer login:</p>
          <a href="${process.env.VITE_FRONTEND_BASE_URL}/">Fazer Login</a>
        `,
      });
  
      console.log("E-mail enviado: %s", info.messageId);
    } else if (data.role === 'PROFESSOR') {
      const { name, to, password } = data;

      const info = await this.transporter.sendMail({
        from: '"Sistema Escolar" <noreply@escola.com>',
        to: to,
        subject: "Bem-vindo! Seu acesso foi criado",
        html: `
          <h1>Olá, ${name}!</h1>
          <p>Seu cadastro no nosso sistema de agendamento acadêmico online como aluno foi realizado com sucesso.</p>
          <p><strong>Seus dados de acesso:</strong></p>
          <ul>
            <li><strong>E-mail institucional:</strong> ${to}</li>
            <li><strong>Senha Provisória:</strong> ${password}</li>
          </ul>
          <p>Acesse o link abaixo para fazer login:</p>
          <a href="${process.env.VITE_FRONTEND_BASE_URL}/">Fazer Login</a>
        `,
      });

      console.log("E-mail enviado: %s", info.messageId);
    }
  }
}
import nodemailer from 'nodemailer';

export class MailService {

  private static transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env['EMAIL_USER'],
      pass: process.env['EMAIL_PASS'],
    }
  });

  public static async sendTemporaryPasswordEmail(
    to: string,
    name: string,
    password: string,
    ra?: string,
  ) {

    await this.transporter.sendMail({
      from: process.env['EMAIL_USER'],
      to,
      subject: 'Acesso ao sistema acadêmico',

      html: `
        <h2>Olá, ${name}!</h2>

        <p>Sua conta foi criada com sucesso.</p>

        ${ra
          ? `<p><strong>RA:</strong> ${ra}</p>`
          : `<p><strong>E-mail de acesso:</strong> ${process.env['EMAIL_USER']}</p>`
        }

        <p>
          <strong>Senha temporária:</strong>
          ${password}
        </p>

        <p>
          No primeiro acesso ao sistema,
          altere sua senha.
        </p>
      `
    });
  }
}
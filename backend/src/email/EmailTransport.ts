import nodemailer from "nodemailer";
import { EmailMessage } from "../types/interface";
import { EmailSubject } from "../types/enum";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export default class EmailTransport {
    private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

    public constructor() {
        this.transporter  = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: <string>process.env.EMAIL_USER,
                pass: <string>process.env.EMAIL_PASS
            }
        });
    }

    public sendRegistrationEmail(toEmail: string) {
        return this.sendGenericEmail(toEmail, {
            subject: EmailSubject.AccountRegistration,
            text: "Your account on [BLOG] was successfully registered."
        });
    }

    private sendGenericEmail(toEmail: string, email: EmailMessage): Promise<SMTPTransport.SentMessageInfo> {
        return this.transporter.sendMail({
            from: "\"blog\" <blog@gmail.com>",
            to: toEmail,
            subject: email.subject,
            text: email.text,
            html: email.html
        })
    }
}
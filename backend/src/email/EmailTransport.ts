import nodemailer from "nodemailer";
import { EmailMessage } from "../types/interface";
import { EmailSubject } from "../types/enum";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export default class EmailTransport {
    private static _instance: EmailTransport;
    private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

    private constructor() {
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

    public sendConfirmationEmail(toEmail: string, token: string) {
        const projectAddress = <string>process.env.ADDRESS;
        const url = `${projectAddress}/email/${token}`;
        return this.sendGenericEmail(toEmail, {
            subject: EmailSubject.EmailCOnfirmation,
            text: `Please confirm your e-mail by clicking on the following address: ${url}. Your token will expire in 5 minutes.`,
            html: `Please confirm your e-mail by <a href=${url}>clicking here</a>. Your token will expire in <b>5 minutes</b>.`
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

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }
}
import nodemailer from "nodemailer";
import ejs from "ejs";
import fs from "fs";
import path from "path";
import { EmailMessage, GenericToken } from "../types/interface";
import { EmailSubject } from "../types/enum";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export default class EmailTransport {
    private static _instance: EmailTransport;
    private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
    private cachedTemplates: Record<string, string> = {};

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

        this.cacheTemplates();
    }

    private cacheTemplates() {
        this.cachedTemplates.emailConfirmation = fs.readFileSync(path.join(__dirname, "./templates/emailConfirmation.ejs"), "utf-8");
        this.cachedTemplates.accountRegistration = fs.readFileSync(path.join(__dirname, "./templates/accountRegistration.ejs"), "utf-8");
        this.cachedTemplates.blogInvitation = fs.readFileSync(path.join(__dirname, "./templates/blogInvitation.ejs"), "utf-8");
    }

    public sendRegistrationEmail(toEmail: string, username: string, token: GenericToken) {
        const projectAddress = <string>process.env.ADDRESS;
        const url = `${projectAddress}/email/${token.hash}`;

        const renderedHTML = ejs.render(this.cachedTemplates.emailConfirmation, { url, username, expirationDate: token.expiration });

        return this.sendGenericEmail(toEmail, {
            subject: EmailSubject.AccountRegistration,
            text: `${username}, welcome to urBlog! Please click on the following link to confirm your email: ${url}`,
            html: renderedHTML
        });
    }

    public async sendConfirmationEmail(toEmail: string, token: GenericToken) {
        const projectAddress = <string>process.env.ADDRESS;
        const url = `${projectAddress}/email/${token.hash}`;

        const renderedHTML = ejs.render(this.cachedTemplates.emailConfirmation, { url, expirationDate: token.expiration });

        return this.sendGenericEmail(toEmail, {
            subject: EmailSubject.EmailConfirmation,
            text: `Please confirm your e-mail by clicking on the following address: ${url}. This link will expire in 5 minutes.`,
            html: renderedHTML
        });
    }

    public async sendBlogInvitationEmail(toEmail: string, data: Record<string, string>, token: GenericToken) {
        const projectAddress = <string>process.env.ADDRESS;
        const url = `${projectAddress}/invite/${token.hash}`;

        const renderedHTML = ejs.render(this.cachedTemplates.blogInvitation, {
            url,
            expirationDate: token.expiration,
            usernameSelf: data.self,
            usernameAuthor: data.author,
            blogName: data.blogName
        });

        return this.sendGenericEmail(toEmail, {
            subject: EmailSubject.BlogInvitation,
            text: `Please click on the following link if you would like to contribute on the blog ${data.blogName}: ${url}. This link will expire in 5 minutes.`,
            html: renderedHTML
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
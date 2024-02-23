interface SendMailOptions {
    to: string;
    html: string;
    subject: string;
}
declare class MailService {
    private transport;
    constructor();
    sendMail({ to, html, subject }: SendMailOptions): any;
}
export declare const mailService: MailService;
export {};

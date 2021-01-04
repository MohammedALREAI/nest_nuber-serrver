export interface IMailOptions {
  apikey: string;
  domain: string;
  fromEmail: string;
}

export const mailConfig: IMailOptions = {
  apikey: process.env.MAILGUN_APIKEY,
  domain: process.env.MAILGUN_DOMAIN,
  fromEmail: process.env.MAILGUN_MAIL_FOR,
};

export interface VTamplat {
  [key: string]: any;
}

export type TemplateType = "verifyEmail" | "restPassword";

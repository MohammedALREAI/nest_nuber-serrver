import { Injectable, Inject, InternalServerErrorException } from "@nestjs/common";
import { IMailOptions } from "./interface/IMail";
import { CONFIG_OPTION } from "../../../modules/jwt/configOption.const";
// import Mailgun from "mailgun-js";

@Injectable()
export class MailService {
  constructor(@Inject(CONFIG_OPTION) private readonly options: IMailOptions) {}

  private sendMessage(tempalte: string, to: string) {
    console.log(tempalte + to);
  }

  sendForgetPassword(vars: { email; firstName; lastName; link }, to: string) {
    const data = {
      from: "Excited User <me@samples.mailgun.org>",
      to,
      template: "forget_password", //Instead of 'html'
      vars,
    };
    // Mailgun.messages().send((error, data) => { });

    if (!data) {
      throw new InternalServerErrorException("some mail options");
    }
  }
}

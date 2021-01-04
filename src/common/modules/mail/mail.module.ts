import { MailService } from "./mail.service";
import { Module, DynamicModule } from "@nestjs/common";
import { IMailOptions } from "./interface/IMail";
import { CONFIG_OPTION } from "../../../modules/jwt/configOption.const";

@Module({})
export class MailModule {
  static forRoot(options: IMailOptions): DynamicModule {
    return {
      global: true,
      module: MailModule,
      providers: [
        {
          provide: CONFIG_OPTION,
          useValue: options,
        },
      ],
      exports: [MailService],
    } as DynamicModule;
  }
}

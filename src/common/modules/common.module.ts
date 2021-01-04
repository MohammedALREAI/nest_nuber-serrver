import { Module, Global } from "@nestjs/common";
import { PUB_SUB } from "../common.constat";
import { PubSub } from "graphql-subscriptions";

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: PUB_SUB,
      useValue: new PubSub(),
    },
  ],
  exports: [PUB_SUB],
})
export class CommonModule {}

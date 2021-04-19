import { Config } from './../config';
import { Global, Module } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

@Global()
@Module({
  providers: [
    {
      provide: Config.PUB_SUB,
      useValue: pubsub,
    },
  ],
  exports: [Config.PUB_SUB],
})
export class CommonModule {}

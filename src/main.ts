import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { AppModule } from "./app.module";
import { config } from "dotenv";
config();
// declare const module: any;
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  await app.listen(process.env.PORT || 4001, () => {
    Logger.log(`🚀  Server is listening on port ${process.env.PORT}`, "Bootstrap", false);
  });
}
bootstrap().catch(e => {
  Logger.error(`❌  Error starting server, ${e}`, "", "Bootstrap", false);
  throw e;
});

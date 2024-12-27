import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectDB } from 'database/db';

async function bootstrap() {

  connectDB();
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000
  await app.listen(port);
  console.log("//////////////////////////////////////////////////////////////////")
  console.log(` .......... App running on port ${port} .......... `)
  console.log("//////////////////////////////////////////////////////////////////")

}
bootstrap();

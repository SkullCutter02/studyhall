import { Module } from "@nestjs/common";
import { Role } from "@prisma/client";
import { ConfigModule } from "@nestjs/config";
import { CaslModule } from "nest-casl";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { configModuleOptions } from "./config/configModuleOptions";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { MailModule } from "./mail/mail.module";
import { RedisModule } from "./redis/redis.module";
import { PrismaModule } from "./prisma/prisma.module";
import { HallModule } from "./hall/hall.module";
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    UserModule,
    AuthModule,
    MailModule,
    RedisModule,
    PrismaModule,
    HallModule,
    CaslModule.forRoot<Role>({
      superuserRole: Role.admin,
      getUserFromRequest: (request) => request.user,
    }),
    QuestionModule,
    AnswerModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

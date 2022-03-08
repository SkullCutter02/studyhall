import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { configModuleOptions } from "./config/configModuleOptions";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { MailModule } from "./mail/mail.module";
import { RedisModule } from "./redis/redis.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), UserModule, AuthModule, MailModule, RedisModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

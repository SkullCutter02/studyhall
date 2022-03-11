import { Module } from "@nestjs/common";

import { AnswerController } from "./answer.controller";
import { AnswerService } from "./answer.service";
import { AnswerGateway } from "./answer.gateway";
import { AuthModule } from "../auth/auth.module";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AnswerController],
  providers: [AnswerService, AnswerGateway],
})
export class AnswerModule {}

import { Module } from "@nestjs/common";
import { CaslModule } from "nest-casl";

import { AnswerController } from "./answer.controller";
import { AnswerService } from "./answer.service";
import { AnswerGateway } from "./answer.gateway";
import { AuthModule } from "../auth/auth.module";
import { PrismaModule } from "../prisma/prisma.module";
import { answerPermissions } from "./permissions/answer.permissions";

@Module({
  imports: [PrismaModule, AuthModule, CaslModule.forFeature({ permissions: answerPermissions })],
  controllers: [AnswerController],
  providers: [AnswerService, AnswerGateway],
})
export class AnswerModule {}

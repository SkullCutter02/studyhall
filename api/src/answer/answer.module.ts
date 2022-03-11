import { Module } from "@nestjs/common";

import { AnswerController } from "./answer.controller";
import { AnswerService } from "./answer.service";
import { AnswerGateway } from "./answer.gateway";

@Module({
  controllers: [AnswerController],
  providers: [AnswerService, AnswerGateway],
})
export class AnswerModule {}

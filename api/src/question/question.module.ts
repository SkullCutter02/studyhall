import { Module } from "@nestjs/common";
import { CaslModule } from "nest-casl";

import { QuestionController } from "./question.controller";
import { QuestionService } from "./question.service";
import { PrismaModule } from "../prisma/prisma.module";
import { questionPermissions } from "./permissions/question.permissions";

@Module({
  imports: [PrismaModule, CaslModule.forFeature({ permissions: questionPermissions })],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}

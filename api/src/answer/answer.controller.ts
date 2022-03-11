import { Controller, Get, Param, ParseUUIDPipe, Query } from "@nestjs/common";

import { AnswerService } from "./answer.service";
import { ParseIncludeQueryPipe } from "../pipes/parseIncludeQuery.pipe";
import { Prisma } from "@prisma/client";

@Controller("answer")
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Get("/:id")
  getAnswer(
    @Param("id", ParseUUIDPipe) answerId: string,
    @Query("include", ParseIncludeQueryPipe) include?: Prisma.AnswerInclude
  ) {
    return this.answerService.findById(answerId, include);
  }
}

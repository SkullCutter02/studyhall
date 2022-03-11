import { Controller, Get, Param, ParseUUIDPipe, Query } from "@nestjs/common";

import { AnswerService } from "./answer.service";
import { ParseIncludeQueryPipe } from "../pipes/parseIncludeQuery.pipe";
import { Prisma } from "@prisma/client";
import { CursorPaginateDto } from "../dto/cursorPaginate.dto";

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

  @Get()
  getAnswers(
    @Query("questionId", ParseUUIDPipe) questionId: string,
    @Query() cursorPaginateDto: CursorPaginateDto,
    @Query("include", ParseIncludeQueryPipe) include?: Prisma.AnswerInclude
  ) {
    return this.answerService.findAll(questionId, cursorPaginateDto, include);
  }
}

import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Query, UseGuards } from "@nestjs/common";
import { AccessGuard, Actions, UseAbility } from "nest-casl";

import { AnswerService } from "./answer.service";
import { ParseIncludeQueryPipe } from "../pipes/parseIncludeQuery.pipe";
import { Prisma } from "@prisma/client";
import { CursorPaginateDto } from "../dto/cursorPaginate.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { EditAnswerDto } from "./dto/editAnswer.dto";
import { Answer } from "../_gen/prisma-class/answer";
import { AnswerHook } from "./permissions/answer.hook";

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

  @Patch("/:id")
  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.update, Answer, AnswerHook)
  editAnswer(@Param("id", ParseUUIDPipe) answerId: string, @Body() editAnswerDto: EditAnswerDto) {
    return this.answerService.edit(answerId, editAnswerDto);
  }

  @Delete("/:id")
  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.delete, Answer, AnswerHook)
  deleteAnswer(@Param("id", ParseUUIDPipe) answerId: string) {
    return this.answerService.delete(answerId);
  }
}

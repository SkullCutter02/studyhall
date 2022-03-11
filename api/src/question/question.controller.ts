import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AccessGuard, Actions, UseAbility } from "nest-casl";
import { Prisma, User } from "@prisma/client";

import { QuestionService } from "./question.service";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { GetUser } from "../decorators/getUser.decorator";
import { CreateQuestionDto } from "./dto/createQuestion.dto";
import { ParseIncludeQueryPipe } from "../pipes/parseIncludeQuery.pipe";
import { CursorPaginateWithFilterDto } from "../dto/cursorPaginateWithFilter.dto";
import { EditQuestionDto } from "./dto/editQuestion.dto";
import { Question } from "../_gen/prisma-class/question";
import { QuestionHook } from "./permissions/question.hook";

@Controller("question")
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get("/:id")
  getQuestion(
    @Param("id", ParseUUIDPipe) questionId: string,
    @Query("include", ParseIncludeQueryPipe) include: Prisma.QuestionInclude
  ) {
    return this.questionService.findById(questionId, include);
  }

  @Get()
  getQuestions(
    @Query("hallId", ParseUUIDPipe) hallId: string,
    @Query() cursorPaginateWithFilterDto: CursorPaginateWithFilterDto,
    @Query("include", ParseIncludeQueryPipe) include?: Prisma.QuestionInclude
  ) {
    return this.questionService.findAllInHall(hallId, cursorPaginateWithFilterDto, include);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createQuestion(@GetUser() user: User, @Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto, user);
  }

  @Patch("/:id")
  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.update, Question, QuestionHook)
  editQuestion(@Param("id", ParseUUIDPipe) questionId: string, @Body() editQuestionDto: EditQuestionDto) {
    return this.questionService.edit(questionId, editQuestionDto);
  }

  @Delete("/:id")
  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.delete, Question, QuestionHook)
  deleteQuestion(@Param("id", ParseUUIDPipe) questionId: string) {
    return this.questionService.delete(questionId);
  }
}

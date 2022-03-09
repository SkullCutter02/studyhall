import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";

import { QuestionService } from "./question.service";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { GetUser } from "../decorators/getUser.decorator";
import { CreateQuestionDto } from "./dto/createQuestion.dto";
import { TransformIncludeQueryPipe } from "../pipes/transformIncludeQuery.pipe";
import { CursorPaginateDto } from "../dto/cursorPaginate.dto";
import { CursorPaginateWithFilterDto } from "../dto/cursorPaginateWithFilter.dto";

@Controller("question")
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get("/:id")
  getQuestion(
    @Param("id", ParseUUIDPipe) questionId: string,
    @Query("include", TransformIncludeQueryPipe) include: Prisma.QuestionInclude
  ) {
    return this.questionService.findById(questionId, include);
  }

  @Get()
  getQuestions(
    @Query("hallId", ParseUUIDPipe) hallId: string,
    @Query() cursorPaginateWithFilterDto: CursorPaginateWithFilterDto,
    @Query("include", TransformIncludeQueryPipe) include?: Prisma.QuestionInclude
  ) {
    return this.questionService.findAllInHall(hallId, cursorPaginateWithFilterDto, include);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createQuestion(@GetUser() user: User, @Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto, user);
  }
}

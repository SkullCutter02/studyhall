import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";

import { QuestionService } from "./question.service";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { GetUser } from "../decorators/getUser.decorator";
import { CreateQuestionDto } from "./dto/createQuestion.dto";
import { TransformIncludeQueryPipe } from "../pipes/transformIncludeQuery.pipe";

@Controller("question")
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get("/:id")
  getHall(
    @Param("id", ParseUUIDPipe) questionId: string,
    @Query("include", TransformIncludeQueryPipe) include: Prisma.QuestionInclude
  ) {
    return this.questionService.findById(questionId, include);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createQuestion(@GetUser() user: User, @Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto, user);
  }
}

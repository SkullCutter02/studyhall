import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";

import { QuestionService } from "./question.service";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { GetUser } from "../decorators/getUser.decorator";
import { CreateQuestionDto } from "./dto/createQuestion.dto";

@Controller("question")
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createQuestion(@GetUser() user: User, @Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto, user);
  }
}

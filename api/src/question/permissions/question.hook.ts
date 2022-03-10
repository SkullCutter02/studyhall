import { Injectable } from "@nestjs/common";
import { SubjectBeforeFilterHook, Request } from "nest-casl";

import { Question } from "../../_gen/prisma-class/question";
import { QuestionService } from "../question.service";

@Injectable()
export class QuestionHook implements SubjectBeforeFilterHook<Question, Request> {
  constructor(private readonly questionService: QuestionService) {}

  async run({ params }: Request) {
    return (await this.questionService.findById(params.id)) as Question;
  }
}

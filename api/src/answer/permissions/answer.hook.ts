import { Injectable } from "@nestjs/common";
import { SubjectBeforeFilterHook, Request } from "nest-casl";

import { Answer } from "../../_gen/prisma-class/answer";
import { AnswerService } from "../answer.service";

@Injectable()
export class AnswerHook implements SubjectBeforeFilterHook<Answer, Request> {
  constructor(private readonly answerService: AnswerService) {}

  async run({ params }: Request) {
    return (await this.answerService.findById(params.id)) as Answer;
  }
}

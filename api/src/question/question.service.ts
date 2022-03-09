import { Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { CreateQuestionDto } from "./dto/createQuestion.dto";

@Injectable()
export class QuestionService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(questionId: string, include?: Prisma.QuestionInclude) {
    return this.prisma.question.findUnique({
      where: { id: questionId },
      include,
    });
  }

  async create({ hallId, ...rest }: CreateQuestionDto, user: User) {
    return this.prisma.question.create({
      data: {
        ...rest,
        hall: {
          connect: {
            id: hallId,
          },
        },
        author: {
          connect: {
            id: user.id,
          },
        },
      },
      include: { author: true, hall: true },
    });
  }
}

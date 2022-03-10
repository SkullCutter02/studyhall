import { Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { CreateQuestionDto } from "./dto/createQuestion.dto";
import { CursorPaginateWithFilterDto } from "../dto/cursorPaginateWithFilter.dto";
import { EditQuestionDto } from "./dto/editQuestion.dto";
import { removeProperty } from "../utils/removeProperty";

@Injectable()
export class QuestionService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(questionId: string, include?: Prisma.QuestionInclude) {
    return this.prisma.question.findUnique({
      where: { id: questionId },
      include,
    });
  }

  async findAllInHall(
    hallId: string,
    { limit, filter, cursor }: CursorPaginateWithFilterDto,
    include?: Prisma.QuestionInclude
  ) {
    const findManyInput: Prisma.QuestionFindManyArgs = {
      take: limit,
      cursor: cursor ? { id: cursor } : undefined,
      where: {
        hallId,
        title: {
          contains: filter,
          mode: "insensitive",
        },
      },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      include,
    };

    const [questions, nextPageCount] = await this.prisma.$transaction([
      this.prisma.question.findMany({ ...findManyInput, skip: cursor ? 1 : undefined }),
      this.prisma.question.count({ ...removeProperty(findManyInput, "include"), skip: cursor ? limit + 1 : limit }),
    ]);

    return { data: questions, hasMore: nextPageCount !== 0 };
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

  async edit(questionId: string, editQuestionDto: EditQuestionDto) {
    return this.prisma.question.update({
      where: { id: questionId },
      data: editQuestionDto,
    });
  }

  async delete(questionId: string) {
    return this.prisma.question.delete({ where: { id: questionId } });
  }
}

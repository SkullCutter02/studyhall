import { Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Prisma, User } from "@prisma/client";
import { Socket } from "socket.io";
import { parse } from "cookie";

import { PrismaService } from "../prisma/prisma.service";
import { AuthService } from "../auth/auth.service";
import { CreateAnswerDto } from "./dto/createAnswer.dto";
import { CursorPaginateDto } from "../dto/cursorPaginate.dto";
import { removeProperty } from "../utils/removeProperty";
import { EditAnswerDto } from "./dto/editAnswer.dto";

@Injectable()
export class AnswerService {
  constructor(private readonly prisma: PrismaService, private readonly authService: AuthService) {}

  findById(answerId: string, include?: Prisma.AnswerInclude) {
    return this.prisma.answer.findUnique({
      where: { id: answerId },
      include,
      rejectOnNotFound: true,
    });
  }

  async findAll(questionId: string, { limit, cursor }: CursorPaginateDto, include?: Prisma.AnswerInclude) {
    const findManyInput: Prisma.AnswerFindManyArgs = {
      take: limit,
      cursor: cursor ? { id: cursor } : undefined,
      where: { questionId },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      include,
    };

    const [answers, nextPageCount] = await this.prisma.$transaction([
      this.prisma.answer.findMany({ ...findManyInput, skip: cursor ? 1 : undefined }),
      this.prisma.answer.count({ ...removeProperty(findManyInput, "include"), skip: cursor ? limit + 1 : limit }),
    ]);

    return { data: answers, hasMore: nextPageCount === 0 };
  }

  create({ questionId, referenceId, ...rest }: CreateAnswerDto, user: User) {
    return this.prisma.answer.create({
      data: {
        ...rest,
        question: { connect: { id: questionId } },
        author: { connect: { id: user.id } },
        reference: { connect: referenceId ? { id: referenceId } : undefined },
      },
      include: { question: true, author: true, reference: true },
    });
  }

  edit(answerId: string, editAnswerDto: EditAnswerDto) {
    return this.prisma.answer.update({
      where: { id: answerId },
      data: editAnswerDto,
      include: { question: true, author: true, reference: true },
    });
  }

  delete(answerId: string) {
    return this.prisma.answer.delete({ where: { id: answerId } });
  }

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    const cookies = parse(cookie);
    const accessToken = cookies["access-token"];
    const user = await this.authService.getUserFromAccessToken(accessToken);

    if (!user) throw new WsException("Invalid credentials");

    return user;
  }
}

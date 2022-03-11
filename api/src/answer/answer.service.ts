import { Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Prisma, User } from "@prisma/client";
import { Socket } from "socket.io";
import { parse } from "cookie";

import { PrismaService } from "../prisma/prisma.service";
import { AuthService } from "../auth/auth.service";
import { CreateAnswerDto } from "./dto/createAnswer.dto";

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

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    const cookies = parse(cookie);
    const accessToken = cookies["access-token"];
    const user = await this.authService.getUserFromAccessToken(accessToken);

    if (!user) throw new WsException("Invalid credentials");

    return user;
  }
}

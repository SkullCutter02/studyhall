import { Injectable } from "@nestjs/common";
import { HallRole, User } from "@prisma/client";

import { CreateHallDto } from "./dto/createHall.dto";
import { PrismaService } from "../prisma/prisma.service";
import { generateAlphanumericString } from "../utils/generateAlphanumericString";

@Injectable()
export class HallService {
  constructor(private readonly prisma: PrismaService) {}

  public async create({ name, nickname }: CreateHallDto, user: User) {
    return this.prisma.hall.create({
      data: {
        name,
        code: generateAlphanumericString(),
        users: {
          create: [
            {
              role: HallRole.teacher,
              nickname,
              joinedAt: new Date(),
              user: {
                connect: {
                  id: user.id,
                },
              },
            },
          ],
        },
      },
    });
  }
}

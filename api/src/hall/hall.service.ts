import { BadRequestException, Injectable } from "@nestjs/common";
import { HallRole, User } from "@prisma/client";

import { CreateHallDto } from "./dto/createHall.dto";
import { PrismaService } from "../prisma/prisma.service";
import { generateAlphanumericString } from "../utils/generateAlphanumericString";

@Injectable()
export class HallService {
  constructor(private readonly prisma: PrismaService) {}

  public async findById(hallId: string) {
    return this.prisma.hall.findUnique({
      where: { id: hallId },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
      rejectOnNotFound: true,
    });
  }

  public async findByUser(userId: string) {
    return this.prisma.hall.findMany({
      where: { users: { some: { userId: userId } } },
    });
  }

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

  public async join(hallId: string, user: User) {
    const doesUserExistsInHall = !!(await this.prisma.user.findFirst({
      where: { AND: { id: user.id, halls: { some: { hallId } } } },
    }));

    if (doesUserExistsInHall) throw new BadRequestException("User has already joined this hall");

    return this.prisma.hall.update({
      where: { id: hallId },
      data: {
        users: {
          create: {
            role: HallRole.student,
            joinedAt: new Date(),
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        },
      },
    });
  }
}

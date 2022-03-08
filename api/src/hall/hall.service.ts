import { BadRequestException, Injectable } from "@nestjs/common";
import { HallRole, User } from "@prisma/client";
import { ConfigService } from "@nestjs/config";

import { CreateHallDto } from "./dto/createHall.dto";
import { PrismaService } from "../prisma/prisma.service";
import { generateAlphanumericString } from "../utils/generateAlphanumericString";
import { EditHallDto } from "./dto/editHall.dto";

@Injectable()
export class HallService {
  constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) {}

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
    const userHalls = await this.findByUser(user.id);

    if (userHalls.length >= this.configService.get<number>("MAX_NUMBER_HALLS"))
      throw new BadRequestException("Maximum joined hall number exceeded");

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

  public async edit(hallId: string, editHallDto: EditHallDto) {
    return this.prisma.hall.update({ where: { id: hallId }, data: editHallDto });
  }

  public async delete(hallId: string) {
    return this.prisma.hall.delete({ where: { id: hallId } });
  }

  public async addUser(hallId: string, user: User) {
    const userHalls = await this.findByUser(user.id);

    if (userHalls.length >= this.configService.get<number>("MAX_NUMBER_HALLS"))
      throw new BadRequestException("Maximum joined hall number exceeded");

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

  public async leave(hallId: string, user: User) {
    const hall = await this.findById(hallId);

    const isUserTeacherInHall = hall.users.some(
      (hallUser) => hallUser.user.id === user.id && hallUser.role === HallRole.teacher
    );
    const teacherCount = await this.prisma.hallsUsers.count({
      where: { role: HallRole.teacher, hallId },
    });

    if (isUserTeacherInHall && teacherCount <= 1)
      throw new BadRequestException("You cannot leave this hall as you are the only teacher in this hall");

    return this.removeUser(hallId, user);
  }

  public async removeUser(hallId: string, user: User) {
    return this.prisma.hall.update({
      where: { id: hallId },
      data: {
        users: {
          deleteMany: {
            userId: user.id,
          },
        },
      },
    });
  }
}

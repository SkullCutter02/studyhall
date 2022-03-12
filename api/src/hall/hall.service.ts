import { BadRequestException, Injectable } from "@nestjs/common";
import { HallRole, Prisma, User } from "@prisma/client";
import { ConfigService } from "@nestjs/config";
import { v4 as uuid } from "uuid";

import { CreateHallDto } from "./dto/createHall.dto";
import { PrismaService } from "../prisma/prisma.service";
import { EditHallDto } from "./dto/editHall.dto";
import { HallWithUsers } from "./types/hallWithUsers.type";

@Injectable()
export class HallService {
  constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) {}

  public async findById(hallId: string, include?: Prisma.HallInclude) {
    return this.prisma.hall.findUnique({
      where: { id: hallId },
      include,
      rejectOnNotFound: true,
    });
  }

  public async findAll(include?: Prisma.HallInclude) {
    return this.prisma.hall.findMany({ include });
  }

  public async findByUser(userId: string, include?: Prisma.HallInclude) {
    return this.prisma.hall.findMany({
      where: { users: { some: { userId: userId } } },
      include,
    });
  }

  public async create({ name, nickname }: CreateHallDto, user: User) {
    return this.prisma.hall.create({
      data: {
        name,
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
    const hall = (await this.findById(hallId, { users: { include: { user: true } } })) as HallWithUsers;

    const isUserTeacherInHall = hall.users.some(
      (hallUser) => hallUser.user.id === user.id && hallUser.role === HallRole.teacher
    );
    const teacherCount = await this.prisma.hallsUsers.count({
      where: { role: HallRole.teacher, hallId },
    });

    if (isUserTeacherInHall && teacherCount <= 1)
      throw new BadRequestException("You cannot leave this hall as you are the only teacher in this hall");

    return this.removeUser(hallId, user.id);
  }

  public async removeUser(hallId: string, userId: string) {
    return this.prisma.hall.update({
      where: { id: hallId },
      data: {
        users: {
          deleteMany: {
            userId,
          },
        },
      },
    });
  }

  public async changeUserRole(hallId: string, userId: string, role: HallRole) {
    return this.prisma.hall.update({
      where: { id: hallId },
      data: {
        users: {
          updateMany: {
            where: { userId },
            data: { role },
          },
        },
      },
    });
  }

  public async setInviteId(hallId: string, inviteId: string = uuid()) {
    return this.prisma.hall.update({
      where: { id: hallId },
      data: { inviteId },
    });
  }

  public async hasUserReachedMaxHallCount(userId: string) {
    const userHalls = await this.findByUser(userId);

    if (userHalls.length >= this.configService.get<number>("MAX_NUMBER_HALLS"))
      throw new BadRequestException("Maximum joined hall number exceeded");

    return true;
  }
}

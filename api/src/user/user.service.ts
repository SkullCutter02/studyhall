import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import * as argon2 from "argon2";
import { Prisma, Role } from "@prisma/client";

import { ChangeUserDetailsDto } from "./dto/changeUserDetails.dto";
import { PrismaService } from "../prisma/prisma.service";
import { FileService } from "../file/file.service";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService, private readonly fileService: FileService) {}

  public async create(email: string, name: string, hash: string) {
    const user = await this.prisma.user
      .create({
        data: {
          name,
          email,
          roles: [Role.user],
          info: {
            create: {
              hash,
            },
          },
        },
      })
      .catch((err) => {
        // code for unique constraint failure
        if (err.code === "P2002" && err.meta.target.includes("email")) {
          throw new BadRequestException("User with such email already exists");
        } else {
          throw new InternalServerErrorException();
        }
      });

    if (user) return user;
  }

  public findById(userId: string, include?: Prisma.UserInclude) {
    return this.prisma.user.findUnique({ where: { id: userId }, include });
  }

  public findByEmail(email: string, include?: Prisma.UserInclude) {
    return this.prisma.user.findUnique({ where: { email }, include });
  }

  public async findByRefreshToken(refreshToken: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { info: true } });

    if (!user) throw new UnauthorizedException();

    if (await argon2.verify(user.info.currentHashedRefreshToken, refreshToken)) {
      return user;
    }
  }

  public async changeHash(hash: string, userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        info: {
          update: {
            hash,
          },
        },
      },
    });
  }

  public async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const hash = await argon2.hash(refreshToken);
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        info: {
          update: {
            currentHashedRefreshToken: hash,
          },
        },
      },
    });
  }

  public async removeCurrentRefreshToken(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        info: {
          update: {
            currentHashedRefreshToken: null,
          },
        },
      },
    });
  }

  public async deleteById(userId: string) {
    return this.prisma.user.delete({ where: { id: userId } });
  }

  public async setDetails(userId: string, changeUserDetailsDto: ChangeUserDetailsDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: changeUserDetailsDto,
    });
  }

  public async addAvatar(userId: string, imageBuffer: Buffer, filename: string) {
    const avatar = await this.fileService.uploadPublicFile(imageBuffer, filename);

    const user = await this.findById(userId);

    if (user.avatarId) await this.fileService.deletePublicFile(user.avatarId);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        avatar: { connect: { id: avatar.id } },
      },
      include: { avatar: true },
    });
  }

  public async deleteAvatar(userId: string) {
    const user = await this.findById(userId);

    if (user.avatarId) {
      await this.fileService.deletePublicFile(user.avatarId);
      return this.findById(userId);
    } else {
      throw new NotFoundException("User has no avatar to delete");
    }
  }
}

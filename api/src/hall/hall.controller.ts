import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { HallRole, User, Prisma } from "@prisma/client";
import { AccessGuard, Actions, UseAbility } from "nest-casl";
import { FileInterceptor } from "@nestjs/platform-express";

import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { GetUser } from "../decorators/getUser.decorator";
import { CreateHallDto } from "./dto/createHall.dto";
import { HallService } from "./hall.service";
import { EditHallDto } from "./dto/editHall.dto";
import { Hall } from "../_gen/prisma-class/hall";
import { HallHook } from "./permissions/hall.hook";
import { CheckMaximumHallsGuard } from "./guards/checkMaximumHalls.guard";
import { ParseIncludeQueryPipe } from "../pipes/parseIncludeQuery.pipe";
import { isFileImage } from "../utils/isFileImage";
import { compressImageBuffer, ImagePreset } from "../utils/compressImageBuffer";

@Controller("hall")
export class HallController {
  constructor(private readonly hallService: HallService) {}

  @Get("/:id")
  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.read, Hall, HallHook)
  getHall(
    @Param("id", ParseUUIDPipe) hallId: string,
    @Query("include", ParseIncludeQueryPipe) include: Prisma.HallInclude
  ) {
    return this.hallService.findById(hallId, include);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getHalls(@Query("include", ParseIncludeQueryPipe) include: Prisma.HallInclude) {
    return this.hallService.findAll(include);
  }

  @Post()
  @UseGuards(JwtAuthGuard, CheckMaximumHallsGuard)
  createHall(@GetUser() user: User, @Body() createHallDto: CreateHallDto) {
    return this.hallService.create(createHallDto, user);
  }

  @Patch("/:id")
  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.update, Hall, HallHook)
  editHall(@Param("id", ParseUUIDPipe) hallId: string, @Body() editHallDto: EditHallDto) {
    return this.hallService.edit(hallId, editHallDto);
  }

  @Delete("/:id")
  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.delete, Hall, HallHook)
  deleteHall(@Param("id", ParseUUIDPipe) hallId: string) {
    return this.hallService.delete(hallId);
  }

  @Patch("/:inviteId/join")
  @UseGuards(JwtAuthGuard, CheckMaximumHallsGuard)
  async joinHall(@Param("inviteId", ParseUUIDPipe) inviteId: string, @GetUser() user: User) {
    const hall = await this.hallService.findByInviteId(inviteId);
    return this.hallService.addUser(hall.id, user);
  }

  @Patch("/:id/leave")
  @UseGuards(JwtAuthGuard)
  leaveHall(@Param("id", ParseUUIDPipe) hallId: string, @GetUser() user: User) {
    return this.hallService.leave(hallId, user);
  }

  @Patch("/:id/generate-invite")
  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.update, Hall, HallHook)
  generateInviteId(@Param("id", ParseUUIDPipe) hallId: string) {
    return this.hallService.setInviteId(hallId);
  }

  @Patch("/:id/invalidate-invite")
  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.update, Hall, HallHook)
  invalidateInviteId(@Param("id", ParseUUIDPipe) hallId: string) {
    return this.hallService.setInviteId(hallId, null);
  }

  @Patch("/:id/promote/:userId")
  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.update, Hall, HallHook)
  promoteUser(
    @Param("id", ParseUUIDPipe) hallId: string,
    @Param("userId", ParseUUIDPipe) userId: string,
    @GetUser() user: User
  ) {
    if (user.id === userId) throw new BadRequestException("You cannot promote yourself!");

    return this.hallService.changeUserRole(hallId, userId, HallRole.teacher);
  }

  @Patch("/:id/demote/:userId")
  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.update, Hall, HallHook)
  demoteUser(
    @Param("id", ParseUUIDPipe) hallId: string,
    @Param("userId", ParseUUIDPipe) userId: string,
    @GetUser() user: User
  ) {
    if (user.id === userId) throw new BadRequestException("You cannot demote yourself!");

    return this.hallService.changeUserRole(hallId, userId, HallRole.student);
  }

  @Patch("/:id/kick/:userId")
  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.update, Hall, HallHook)
  kick(
    @Param("id", ParseUUIDPipe) hallId: string,
    @Param("userId", ParseUUIDPipe) userId: string,
    @GetUser() user: User
  ) {
    if (user.id === userId) throw new BadRequestException("You cannot kick yourself!");

    return this.hallService.removeUser(hallId, userId);
  }

  @Post("/:id/image")
  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.update, Hall, HallHook)
  @UseInterceptors(FileInterceptor("file"))
  async addHallImage(@Param("id", ParseUUIDPipe) hallId: string, @UploadedFile() file: Express.Multer.File) {
    if (!isFileImage(file.mimetype)) throw new BadRequestException("File uploaded is not an image");

    const compressedImageBuffer = await compressImageBuffer(file.buffer, ImagePreset.SM);

    return this.hallService.addImage(hallId, compressedImageBuffer, file.originalname);
  }
}

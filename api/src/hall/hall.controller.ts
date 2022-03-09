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
  UseGuards,
} from "@nestjs/common";
import { HallRole, User, Prisma } from "@prisma/client";
import { AccessGuard, Actions, UseAbility } from "nest-casl";

import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { GetUser } from "../decorators/getUser.decorator";
import { CreateHallDto } from "./dto/createHall.dto";
import { HallService } from "./hall.service";
import { EditHallDto } from "./dto/editHall.dto";
import { Hall } from "../_gen/prisma-class/hall";
import { HallHook } from "./permissions/hall.hook";
import { CheckMaximumHallsGuard } from "./guards/checkMaximumHalls.guard";
import { TransformIncludeQueryPipe } from "../pipes/transformIncludeQuery.pipe";

@Controller("hall")
export class HallController {
  constructor(private readonly hallService: HallService) {}

  @Get("/:id")
  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.read, Hall, HallHook)
  getHall(
    @Param("id", ParseUUIDPipe) hallId: string,
    @Query("include", TransformIncludeQueryPipe) include: Prisma.HallInclude
  ) {
    return this.hallService.findById(hallId, include);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getHalls(@GetUser() user: User, @Query("include", TransformIncludeQueryPipe) include: Prisma.HallInclude) {
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

  @Patch("/:id/join")
  @UseGuards(JwtAuthGuard, CheckMaximumHallsGuard)
  joinHall(@Param("id", ParseUUIDPipe) hallId: string, @GetUser() user: User) {
    return this.hallService.addUser(hallId, user);
  }

  @Patch("/:id/leave")
  @UseGuards(JwtAuthGuard)
  leaveHall(@Param("id", ParseUUIDPipe) hallId: string, @GetUser() user: User) {
    return this.hallService.leave(hallId, user);
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
}

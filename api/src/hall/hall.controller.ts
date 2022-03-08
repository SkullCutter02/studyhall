import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { AccessGuard, Actions, UseAbility } from "nest-casl";

import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { GetUser } from "../decorators/getUser.decorator";
import { CreateHallDto } from "./dto/createHall.dto";
import { HallService } from "./hall.service";
import { EditHallDto } from "./dto/editHall.dto";
import { Hall } from "../_gen/prisma-class/hall";
import { HallHook } from "./permissions/hall.hook";

@Controller("hall")
export class HallController {
  constructor(private readonly hallService: HallService) {}

  @Get("/:id")
  getHall(@Param("id", ParseUUIDPipe) hallId: string) {
    return this.hallService.findById(hallId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getHalls(@GetUser() user: User) {
    return this.hallService.findByUser(user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  joinHall(@Param("id", ParseUUIDPipe) hallId: string, @GetUser() user: User) {
    return this.hallService.join(hallId, user);
  }

  @Patch("/:id/leave")
  @UseGuards(JwtAuthGuard)
  leaveHall(@Param("id", ParseUUIDPipe) hallId: string, @GetUser() user: User) {
    return this.hallService.leave(hallId, user);
  }
}

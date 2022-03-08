import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";

import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { GetUser } from "../decorators/getUser.decorator";
import { CreateHallDto } from "./dto/createHall.dto";
import { HallService } from "./hall.service";

@Controller("hall")
export class HallController {
  constructor(private readonly hallService: HallService) {}

  @Get("/:id")
  getHall(@Param("id", ParseUUIDPipe) hallId: string) {
    return this.hallService.findById(hallId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createHall(@GetUser() user: User, @Body() createHallDto: CreateHallDto) {
    return this.hallService.create(createHallDto, user);
  }
}

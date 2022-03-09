import { Body, Controller, Get, Patch, Query, UseGuards } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";

import { UserService } from "./user.service";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { ChangeUserDetailsDto } from "./dto/changeUserDetails.dto";
import { GetUser } from "../decorators/getUser.decorator";
import { TransformIncludeQueryPipe } from "../pipes/transformIncludeQuery.pipe";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/me")
  @UseGuards(JwtAuthGuard)
  me(@GetUser() user: User, @Query("include", TransformIncludeQueryPipe) include: Prisma.UserInclude) {
    return this.userService.findById(user.id, include);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  changeUserDetails(@GetUser() user: User, @Body() changeUserDetailsDto: ChangeUserDetailsDto) {
    return this.userService.setDetails(user.id, changeUserDetailsDto);
  }
}

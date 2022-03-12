import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { FileInterceptor } from "@nestjs/platform-express";

import { UserService } from "./user.service";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { ChangeUserDetailsDto } from "./dto/changeUserDetails.dto";
import { GetUser } from "../decorators/getUser.decorator";
import { ParseIncludeQueryPipe } from "../pipes/parseIncludeQuery.pipe";
import { isFileImage } from "../utils/isFileImage";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/me")
  @UseGuards(JwtAuthGuard)
  me(@GetUser() user: User, @Query("include", ParseIncludeQueryPipe) include: Prisma.UserInclude) {
    // if the request requests user.info, it will delete it automatically
    delete include?.info;
    return this.userService.findById(user.id, include && Object.keys(include).length && include);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  changeUserDetails(@GetUser() user: User, @Body() changeUserDetailsDto: ChangeUserDetailsDto) {
    return this.userService.setDetails(user.id, changeUserDetailsDto);
  }

  @Post("/avatar")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  addAvatar(@GetUser() user: User, @UploadedFile() file: Express.Multer.File) {
    if (!isFileImage(file.mimetype)) throw new BadRequestException("File uploaded is not an image");

    return this.userService.addAvatar(user.id, file.buffer, file.originalname);
  }

  @Delete("/avatar")
  @UseGuards(JwtAuthGuard)
  deleteAvatar(@GetUser() user: User) {
    return this.userService.deleteAvatar(user.id);
  }
}

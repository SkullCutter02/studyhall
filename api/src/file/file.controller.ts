import {
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { FileService } from "./file.service";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { compressImageBuffer, ImagePreset } from "../utils/compressImageBuffer";
import { ParseImagePresetPipe } from "../pipes/parseImagePreset.pipe";

@Controller("file")
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post("/image")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async postImage(
    @UploadedFile() file: Express.Multer.File,
    @Query("preset", ParseImagePresetPipe) preset: keyof typeof ImagePreset
  ) {
    const compressedImageBuffer = await compressImageBuffer(file.buffer, ImagePreset[preset]);

    return this.fileService.uploadPublicFile(compressedImageBuffer, file.originalname);
  }

  @Delete("/image/:id")
  @UseGuards(JwtAuthGuard)
  deleteImage(@Param("id", ParseUUIDPipe) imageId: string) {
    return this.fileService.deletePublicFile(imageId);
  }
}

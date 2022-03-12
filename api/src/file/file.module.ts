import { Module } from "@nestjs/common";

import { FileService } from "./file.service";
import { FileController } from "./file.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  providers: [FileService, PrismaModule],
  controllers: [FileController],
})
export class FileModule {}

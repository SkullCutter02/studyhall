import { Module } from "@nestjs/common";

import { HallController } from "./hall.controller";
import { HallService } from "./hall.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [HallController],
  providers: [HallService],
})
export class HallModule {}

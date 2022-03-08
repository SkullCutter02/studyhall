import { Module } from "@nestjs/common";
import { CaslModule } from "nest-casl";

import { HallController } from "./hall.controller";
import { HallService } from "./hall.service";
import { PrismaModule } from "../prisma/prisma.module";
import { hallPermissions } from "./permissions/hall.permissions";

@Module({
  imports: [PrismaModule, CaslModule.forFeature({ permissions: hallPermissions })],
  controllers: [HallController],
  providers: [HallService],
})
export class HallModule {}

import { Module } from "@nestjs/common";
import { CaslModule } from "nest-casl";

import { HallController } from "./hall.controller";
import { HallService } from "./hall.service";
import { PrismaModule } from "../prisma/prisma.module";
import { hallPermissions } from "./permissions/hall.permissions";
import { FileModule } from "../file/file.module";

@Module({
  imports: [PrismaModule, CaslModule.forFeature({ permissions: hallPermissions }), FileModule],
  controllers: [HallController],
  providers: [HallService],
})
export class HallModule {}

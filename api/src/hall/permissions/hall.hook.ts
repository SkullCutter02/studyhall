import { Injectable } from "@nestjs/common";
import { SubjectBeforeFilterHook, Request } from "nest-casl";

import { Hall } from "../../_gen/prisma-class/hall";
import { HallService } from "../hall.service";

@Injectable()
export class HallHook implements SubjectBeforeFilterHook<Hall, Request> {
  constructor(private readonly hallService: HallService) {}

  async run({ params }: Request) {
    return (await this.hallService.findById(params.id)) as Hall;
  }
}

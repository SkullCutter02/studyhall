import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { HallService } from "../hall.service";

@Injectable()
export class CheckMaximumHallsGuard implements CanActivate {
  constructor(private readonly hallService: HallService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.hallService.hasUserReachedMaxHallCount(request.user.id);
  }
}

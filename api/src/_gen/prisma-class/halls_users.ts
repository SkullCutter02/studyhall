import { Hall } from "./hall";
import { User } from "./user";
import { HallRole } from "@prisma/client";

export class HallsUsers {
  role: HallRole;

  nickname?: string;

  joinedAt: Date;

  hall: Hall;

  hallId: string;

  user: User;

  userId: string;
}

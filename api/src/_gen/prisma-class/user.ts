import { Info } from "./info";
import { HallsUsers } from "./halls_users";
import { Question } from "./question";
import { Answer } from "./answer";
import { Role } from "@prisma/client";

export class User {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  name: string;

  email: string;

  roles: Role[];

  info?: Info;

  halls: HallsUsers[];

  questions: Question[];

  answers: Answer[];
}

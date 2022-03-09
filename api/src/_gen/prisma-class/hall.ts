import { HallsUsers } from "./halls_users";
import { Question } from "./question";

export class Hall {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  name: string;

  code: string;

  users: HallsUsers[];

  questions: Question[];
}

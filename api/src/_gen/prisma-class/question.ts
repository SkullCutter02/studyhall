import { User } from "./user";
import { Hall } from "./hall";
import { Answer } from "./answer";

export class Question {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  title: string;

  body: string;

  whiteboard?: string;

  answered: boolean;

  author?: User;

  authorId?: string;

  hall: Hall;

  hallId: string;

  answers: Answer[];
}

import { User } from "./user";
import { Hall } from "./hall";

export class Question {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  title: string;

  body: string;

  whiteboard?: string;

  answered: boolean;

  author?: User;

  authorId: string;

  hall: Hall;

  hallId: string;
}

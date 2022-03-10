import { User } from "./user";
import { Question } from "./question";

export class Answer {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  body: string;

  author?: User;

  authorId?: string;

  question: Question;

  questionId: string;

  reference?: Answer;

  referenceId?: string;

  references: Answer[];
}

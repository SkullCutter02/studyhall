import { HallsUsers } from "./halls_users";
import { Question } from "./question";
import { PublicFile } from "./public_file";

export class Hall {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  name: string;

  inviteId?: string;

  users: HallsUsers[];

  questions: Question[];

  image?: PublicFile;

  imageId?: string;
}

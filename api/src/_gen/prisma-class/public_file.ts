import { User } from "./user";
import { Hall } from "./hall";

export class PublicFile {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  url: string;

  key: string;

  user?: User;

  hall?: Hall;
}

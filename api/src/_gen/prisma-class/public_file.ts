import { User } from "./user";

export class PublicFile {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  url: string;

  key: string;

  user?: User;
}

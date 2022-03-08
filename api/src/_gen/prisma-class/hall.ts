import { HallsUsers } from "./halls_users";

export class Hall {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  name: string;

  code: string;

  users: HallsUsers[];
}

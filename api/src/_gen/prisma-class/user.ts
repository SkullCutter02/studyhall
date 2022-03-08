import { Info } from "./info";
import { HallsUsers } from "./halls_users";

export class User {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  name: string;

  email: string;

  info?: Info;

  halls: HallsUsers[];
}

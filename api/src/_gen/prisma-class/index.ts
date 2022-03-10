import { User as _User } from "./user";
import { Hall as _Hall } from "./hall";
import { Question as _Question } from "./question";
import { Answer as _Answer } from "./answer";
import { HallsUsers as _HallsUsers } from "./halls_users";
import { Info as _Info } from "./info";

export namespace PrismaModel {
  export class User extends _User {}
  export class Hall extends _Hall {}
  export class Question extends _Question {}
  export class Answer extends _Answer {}
  export class HallsUsers extends _HallsUsers {}
  export class Info extends _Info {}

  export const extraModels = [User, Hall, Question, Answer, HallsUsers, Info];
}

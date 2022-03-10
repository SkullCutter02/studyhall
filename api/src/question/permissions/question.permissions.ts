import { Actions, InferSubjects, Permissions } from "nest-casl";
import { Question } from "../../_gen/prisma-class/question";
import { Role } from "@prisma/client";

type Subjects = InferSubjects<typeof Question>;

export const questionPermissions: Permissions<Role, Subjects, Actions> = {
  everyone({ can }) {
    can(Actions.read, Question);
    can(Actions.create, Question);
  },

  user({ can, user }) {
    can(Actions.update, Question, { authorId: user.id });
    can(Actions.delete, Question, { authorId: user.id });
  },
};

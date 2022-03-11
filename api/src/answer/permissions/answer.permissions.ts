import { InferSubjects, Permissions, Actions } from "nest-casl";
import { Role } from "@prisma/client";

import { Answer } from "../../_gen/prisma-class/answer";

type Subjects = InferSubjects<typeof Answer>;

export const answerPermissions: Permissions<Role, Subjects, Actions> = {
  everyone({ can }) {
    can(Actions.read, Answer);
    can(Actions.create, Answer);
  },

  user({ can, user }) {
    can(Actions.update, Answer, { authorId: user.id });
    can(Actions.delete, Answer, { authorId: user.id });
  },
};

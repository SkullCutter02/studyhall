import { Actions, InferSubjects, Permissions } from "nest-casl";
import { HallRole, Role } from "@prisma/client";

import { Hall } from "../../_gen/prisma-class/hall";

type Subjects = InferSubjects<typeof Hall>;

export const hallPermissions: Permissions<Role, Subjects, Actions> = {
  everyone({ can }) {
    can(Actions.read, Hall);
    can(Actions.create, Hall);
  },

  user({ can, user }) {
    can(Actions.update, Hall, { users: { $elemMatch: { role: HallRole.teacher, userId: user.id } } });
    can(Actions.delete, Hall, { users: { $elemMatch: { role: HallRole.teacher, userId: user.id } } });
  },
};

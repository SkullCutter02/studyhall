import { Actions, InferSubjects, Permissions } from "nest-casl";
import { HallRole, Role } from "@prisma/client";

import { Hall } from "../../_gen/prisma-class/hall";

type Subjects = InferSubjects<typeof Hall>;

export const hallPermissions: Permissions<Role, Subjects, Actions> = {
  everyone({ can }) {
    can(Actions.create, Hall);
  },

  user({ can, user }) {
    // a user can only get a hall if the user is part of the hall
    can(Actions.read, Hall, { users: { $elemMatch: { userId: user.id } } });

    // a user can only update / delete a hall if the user is part of the hall, and is a teacher
    can(Actions.update, Hall, { users: { $elemMatch: { role: HallRole.teacher, userId: user.id } } });
    can(Actions.delete, Hall, { users: { $elemMatch: { role: HallRole.teacher, userId: user.id } } });
  },
};

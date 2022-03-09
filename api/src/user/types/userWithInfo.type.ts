import { Prisma } from "@prisma/client";

const userWithInfo = Prisma.validator<Prisma.UserArgs>()({
  include: { info: true },
});

export type UserWithInfo = Prisma.UserGetPayload<typeof userWithInfo>;

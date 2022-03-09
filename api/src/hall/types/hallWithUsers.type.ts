import { Prisma } from "@prisma/client";

const hallWithUsers = Prisma.validator<Prisma.HallArgs>()({
  include: { users: { include: { user: true } } },
});

export type HallWithUsers = Prisma.HallGetPayload<typeof hallWithUsers>;

import React, { createContext } from "react";

import User from "../types/user.interface";

interface Props {
  user: User | null;
}

export const UserContext = createContext<User | null>(null);

export const UserProvider: React.FC<Props> = ({ user, children }) => {
  return (
    <>
      <UserContext.Provider value={user}>{children}</UserContext.Provider>
    </>
  );
};

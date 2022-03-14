import React, { useContext } from "react";
import { Text } from "@chakra-ui/react";

import { withAuthServerSideProps } from "../hoc/withAuthServerSideProps";
import { UserContext } from "../context/UserContext";

const HomePage: React.FC<any> = () => {
  const user = useContext(UserContext);

  return (
    <>
      <Text color={"primary"}>Current logged in user: {user.name}</Text>
    </>
  );
};

export const getServerSideProps = withAuthServerSideProps();

export default HomePage;

import React from "react";
import { Text } from "@chakra-ui/react";

import { withAuthServerSideProps } from "../hoc/withAuthServerSideProps";

const HomePage: React.FC<any> = () => {
  return (
    <>
      <Text color={"primary"}>Hello World</Text>
    </>
  );
};

export const getServerSideProps = withAuthServerSideProps();

export default HomePage;

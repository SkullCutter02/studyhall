import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  sizes: {
    "4xs": "10rem",
    "5xs": "6rem",
    "6xs": "2rem",
  },
  colors: {
    primary: "#0584e3",
    secondary: "#fb452d",
    secondaryText: "#a4a4a4",
  },
  textStyles: {
    error: {
      color: "#bd1717",
      fontSize: 15,
    },
  },
});

export default theme;

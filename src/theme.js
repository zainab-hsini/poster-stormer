import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    colors: {
      brand: {
        primary: "#E50914", // Netflix Red
        secondary: "#000000", // Dark background
        lightGray: "#F7FAFC", // Light gray for containers
        white: "#FFFFFF", // White
        darkGray: "A9A9A9"
      },
    },
    fonts: {
      heading: "Montserrat, sans-serif",
      body: "Open Sans, sans-serif",
    },
    styles: {
      global: {
        body: {
          bg: "brand.secondary", // Dark background for the app
          color: "brand.lighrGray", // Text color
        },
      },
    },
  });
  
  export default theme;
import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

let lightTheme = createMuiTheme({
  typography: {
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      color: "#1708A3",
      marginTop: "2%",
      marginBottom: "2%",
      fontFamily: "Ubuntu"
    },
    button: {
      fontWeight: 700,
      fontSize: "1rem"
    },
    overline: {
      fontFamily: "Ubuntu",
      fontWeight: 600,
      fontSize: "0.8rem"
    },
    caption: {
      fontFamily: "Ubuntu",
      fontWeight: 600,
      fontSize: "1.2rem"
    },
    body2: {
      fontFamily: "Ubuntu"
    }
  },
  palette: {
    primary: {
      main: "#ffdd84",
      contrastText: "#26294f",
      hover: "#7A6EEB"
      // main: "#221B2C",
    },
    secondary: {
      main: "#26294f"
    },
    info: {
      main: "#7791a1"
    },
    inactive: {
      main: "#009969"
    },
    active: {
      main: "#a00000"
    },
    recentlyActive: {
      main: "#cd00ad"
    },
    link: {
      main: "#002f2b"
    },
    background: {
      paper: "#EBDFB0",
      main: "#DDEBE2"
    },
    text: {
      primary: "#1708A3"
    }
  },
  overrides: {
    MuiFormLabel: {
      root: {
        color: "inherit"
      }
    },
    MuiListItem: {
      button: {
        color: "#1708A3",
        backgroundColor: "#ffdd84",
        "&:hover": {
          backgroundColor: "#7A6EEB"
        }
      }
    },
    MuiIconButton: {
      root: {
        "&:hover": {
          backgroundColor: "#7A6EEB"
        }
      }
    }
  }
});

lightTheme = responsiveFontSizes(lightTheme);

export default lightTheme;

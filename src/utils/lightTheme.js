import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

let lightTheme = createMuiTheme({
  typography: {
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      color: "#302d27",
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
      main: "#11eba4",
      contrastText: "#26294f",
      hover: "#ffdd84"
      // main: "#221B2C",
    },
    secondary: {
      main: "#9e2c65"
    },
    info: {
      main: "#7791a1"
    },
    inactive: {
      main: "#0096c4"
    },
    active: {
      main: "#cf3401"
    },
    recentlyActive: {
      main: "#3b9138"
    },
    link: {
      main: "#3e3434"
    },
    background: {
      paper: "#bea5c5",
      main: "#f8f7f7"
    },
    text: {
      primary: "#26294f"
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
        color: "#26294f",
        backgroundColor: "#11eba4",
        "&:hover": {
          backgroundColor: "#ffdd84"
        }
      }
    },
    MuiIconButton: {
      root: {
        "&:hover": {
          backgroundColor: "#ffdd84"
        }
      }
    }
  }
});

lightTheme = responsiveFontSizes(lightTheme);

export default lightTheme;

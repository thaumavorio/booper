import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

let lightTheme = createMuiTheme({
  typography: {
    h3: {
      fontSize: "24px",
      fontWeight: 600,
      color: "#302d27",
      marginTop: 10,
      marginBottom: 10,
      fontFamily: "Ubuntu"
    },
    button: {
      fontWeight: 700,
      fontSize: "16px"
    },
    overline: {
      fontFamily: "Ubuntu",
      fontWeight: 600,
      fontSize: "14px"
    },
    caption: {
      fontFamily: "Ubuntu",
      fontWeight: 600,
      fontSize: "24px"
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

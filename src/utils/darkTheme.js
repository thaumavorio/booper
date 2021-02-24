import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

let darkTheme = createMuiTheme({
  typography: {
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      color: "#f8c90d",
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
      main: "#304586",
      contrastText: "#f7f6a8",
      hover: "#221B2C"
      // main: "#221B2C",
    },
    secondary: {
      main: "#f7f6a8"
    },
    info: {
      main: "#7791a1"
    },
    inactive: {
      main: "#00b5ff"
    },
    active: {
      main: "#f53500"
    },
    recentlyActive: {
      main: "#c0ea4f"
    },
    link: {
      main: "#a9a972"
    },
    background: {
      paper: "#655e86",
      main: "#110841"
    },
    text: {
      primary: "#dede96"
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
        color: "#f7f6a8",
        backgroundColor: "#304586",
        "&:hover": {
          backgroundColor: "#221B2C"
        }
      }
    },
    MuiIconButton: {
      root: {
        "&:hover": {
          backgroundColor: "#221B2C"
        }
      }
    }
  }
});

darkTheme = responsiveFontSizes(darkTheme);

export default darkTheme;

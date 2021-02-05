import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

let lightTheme = createMuiTheme({
  typography: {
    h3: {
      fontSize: "24px",
      fontWeight: 600,
      color: "#030f28",
      marginTop: 10,
      marginBottom: 10
    },
    button: {
      fontWeight: 700
    },
    overline: {
      fontWeight: 500,
      fontSize: "13px"
    },
    caption: {
      fontWeight: 500,
      fontSize: "18px",
      lineHeight: 1.75,
      textTransform: "uppercase"
    }
  },
  palette: {
    primary: {
      main: "#6bc3b8",
      contrastText: "#302d27",
      hover: "#221B2C"
      // main: "#221B2C",
    },
    secondary: {
      main: "#e3e3d6"
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
      main: "#ff6dcf"
    },
    link: {
      main: "#a9a972"
    },
    background: {
      paper: "#9898e7",
      main: "#e3e3d6"
    },
    text: {
      primary: "#2f1c01"
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
        color: "#302d27",
        backgroundColor: "#6bc3b8",
        "&:hover": {
          backgroundColor: "#cb9531"
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

lightTheme = responsiveFontSizes(lightTheme);

export default lightTheme;

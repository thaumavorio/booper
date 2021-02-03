import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

let theme = createMuiTheme({
  typography: {
    button: {
      fontWeight: 800
    },
    overline: {
      fontWeight: 500,
      fontSize: "13px"
    },
    caption: {
      fontWeight: 600,
      fontSize: "20px",
      lineHeight: 1.75,
      textTransform: "uppercase"
    }
  },
  palette: {
    primary: {
      main: "#5b83ff",
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
      main: "#ff6dcf"
    },
    link: {
      main: "#a9a972"
    },
    background: {
      paper: "#655e86",
      main: "#413c58"
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
        backgroundColor: "#5b83ff",
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

theme = responsiveFontSizes(theme);

export default theme;

import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

let theme = createMuiTheme({
  typography: {

  },
  palette: {
    primary: {
      main: "#5d79b8",
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
      main: "#9060ff"
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
        backgroundColor: "#5d79b8"
      }
    }
  }
});

theme = responsiveFontSizes(theme);

export default theme;

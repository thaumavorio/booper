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
      main: "#5375e2"
    },
    active: {
      main: "#f65868"
    },
    background: {
      paper: "#655e86",
      main: "#c6d1e1"
    },
    text: {
      primary: "#dede96"
    }
  }
});

theme = responsiveFontSizes(theme);

export default theme;

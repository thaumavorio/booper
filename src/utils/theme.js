import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

let theme = createMuiTheme({
  palette: {
    primary: {
      main: "#221B2C"
    },
    secondary: {
      main: "#5d79b8"
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
  }
});

theme = responsiveFontSizes(theme);

export default theme;

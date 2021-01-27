import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

let theme = createMuiTheme({
  palette: {
    primary: {
      main: "#221B2C"
    },
    secondary: {
      main: "#83AAA4"
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
      paper: "#C6DFE1",
      main: "#fefefe"
    },
  }
});

theme = responsiveFontSizes(theme);

export default theme;

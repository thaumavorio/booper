import { createMuiTheme, responsiveFontSizes } from "@material-ui/core";


let theme = createMuiTheme({
  palette: {
    primary: {
      main: "#5c616e"
    },
    secondary: {
      main: "#f3aa92"
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
      main: "#fefefe"
    },
  }
});

theme = responsiveFontSizes(theme);

export default theme;

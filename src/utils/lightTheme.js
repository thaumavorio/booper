/*
 * This file is part of Booper, a bootstrap percolation visualization tool.
 * Copyright (C) 2020-2021 Connor Anderson <canderson@thaumavor.io>, Akshaj
 * Balasubramanian <bakshaj99@gmail.com>, Henry Poskanzer <hposkanzer@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

let lightTheme = createMuiTheme({
  typography: {
    h1: {
      fontSize: "6rem",
      fontWeight: 800,
      fontFamily: "Ubuntu"
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      color: "#1708A3",
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
      main: "#ffdd84",
      contrastText: "#26294f",
      hover: "#7A6EEB"
      // main: "#221B2C",
    },
    secondary: {
      main: "#26294f"
    },
    info: {
      main: "#7791a1"
    },
    inactive: {
      main: "#009969"
    },
    active: {
      main: "#a00000"
    },
    recentlyActive: {
      main: "#cd00ad"
    },
    link: {
      main: "#002f2b"
    },
    background: {
      paper: "#EBDFB0",
      main: "#DDEBE2"
    },
    text: {
      primary: "#1708A3"
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
        color: "#1708A3",
        backgroundColor: "#ffdd84",
        "&:hover": {
          backgroundColor: "#7A6EEB"
        }
      }
    },
    MuiIconButton: {
      root: {
        "&:hover": {
          backgroundColor: "#7A6EEB"
        }
      }
    }
  }
});

lightTheme = responsiveFontSizes(lightTheme);

export default lightTheme;

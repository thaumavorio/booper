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
import React, { useEffect, useState } from "react";
import { Button, CssBaseline, Fade, makeStyles, Typography } from "@material-ui/core";

declare module "@material-ui/core/styles/createPalette" {
  interface PaletteColor {
    hover: string;
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    backgroundImage: `url(${process.env.PUBLIC_URL + "/Booper_Background_4K.png"})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  landingIntro: {
    position: "sticky",
    left: "2rem",
    bottom: "1rem",
    alignSelf: "flex-end",
    color: "#002F38"
  },
  booText: {
    color: "#B591FA"
  },
  perText: {
    color: "#FA8878"
  },
  startButton: {
    fontSize: "5rem",
    fontFamily: "inherit",
    fontWeight: "inherit",
    left: "1rem",
    lineHeight: "6rem",
    bottom: "0.5rem",
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      background: theme.palette.primary.hover,
    }
  }
}));

function Home(): JSX.Element {
  const classes = useStyles();
  const [checked,setChecked] = useState(false);
  useEffect(()=>{
    setChecked(true);
  },[]);
  return (
    <div className={classes.root}>
      <CssBaseline/>
      <div className={classes.landingIntro}>
        <Fade in={checked} {...(checked ? { timeout: 1000 } : {})}>
          <Typography variant="h1" align="left">
            <span className={classes.booText}>Boo</span>tstrap
            <br/>
            <span className={classes.perText}>Per</span>colation,
            <br/>
          </Typography>
        </Fade>
        <Fade in={checked} {...(checked ? { timeout: 2000 } : {})}>
          <Typography variant="h1" align="left">
            for everyone.
            <Button size="small" variant="contained" className={classes.startButton} href="study">
              Start Here
            </Button>
          </Typography>
        </Fade>
      </div>
    </div>
  );
}

export default Home;

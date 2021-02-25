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
import React, { Component } from "react";
import { AppBar, Box, IconButton, List, ListItem, ListItemText, Toolbar, Typography } from "@material-ui/core";
import { Home } from "@material-ui/icons";
import { styled } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { Checkbox } from "@material-ui/core";
import PropTypes from "prop-types";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import Brightness3Icon from "@material-ui/icons/Brightness3";

const navLinks = [
  { title: "Learn", path: "/bp/learn" },
  { title: "Research", path: "/bp/research" },
  { title: "Study", path: "/bp/study" },
  { title: "About Us", path: "/bp/about-us" },
];

// Local Components
const HeaderBox = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  alignContent: "center",
  justifyContent: "space-between",
  width: "100%"
});

const LinkBox = styled(Box)({
  display: "flex",
  flexDirection: "row"
});

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      darkMode: true
    };
  }

  updateTheme(){
    this.props.sendTheme(this.state.darkMode);
  }

  toggleDarkMode = (event, value) => {
    // value is true when the user engages the checkbox for light mode
    this.setState({
      darkMode: !value
    });
    this.updateTheme();
  }

  render() {
    return (
      <AppBar color="primary" position="sticky">
        <Toolbar>
          <HeaderBox>
            <IconButton edge="start" aria-label="home">
              <Link to="/bp/">
                <Home color="secondary" fontSize="large" />
              </Link>
            </IconButton>
            <LinkBox>
              <List component="nav" aria-labelledby="main navigation">
                <LinkBox>
                  {navLinks.map(({ title, path }) => (
                    <Link key={title} to={path} style={{textDecoration: "none"}}>
                      <ListItem button>
                        <ListItemText primary={<React.Fragment>
                          <Typography variant="button" gutterBottom>
                            { title }
                          </Typography>
                        </React.Fragment>}/>
                      </ListItem>
                    </Link>
                  ))}
                </LinkBox>
              </List>
              <Checkbox color="secondary" onChange={this.toggleDarkMode} checkedIcon={<WbSunnyIcon fontSize="large" color="secondary"/>} icon={<Brightness3Icon fontSize="large" color="secondary"/>}/>
            </LinkBox>
          </HeaderBox>
        </Toolbar>
      </AppBar>
    );
  }
}



Header.propTypes = {
  sendTheme: PropTypes.func
};

export default Header;

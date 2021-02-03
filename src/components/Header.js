import React, { Component } from "react";
import {AppBar, Box, IconButton, List, ListItem, ListItemText, Toolbar} from "@material-ui/core";
import { Home } from "@material-ui/icons";
import { styled } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const navLinks = [
  { title: "Learn", path: "/learn" },
  { title: "Research", path: "/research" },
  { title: "Study", path: "/study" },
  { title: "About Us", path: "/about-us" },
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
  render() {
    return (
      <AppBar color="primary" position="static">
        <Toolbar>
          <HeaderBox>
            <IconButton edge="start" aria-label="home">
              <Link to="/">
                <Home color="secondary" fontSize="large" />
              </Link>
            </IconButton>
            <List component="nav" aria-labelledby="main navigation">
              <LinkBox>
                {navLinks.map(({ title, path }) => (
                  <Link key={title} to={path} style={{textDecoration: "none"}}>
                    <ListItem button>
                      <ListItemText primary={title}/>
                    </ListItem>
                  </Link>
                ))}
              </LinkBox>
            </List>
          </HeaderBox>
        </Toolbar>
      </AppBar>
    );
  }
}
export default Header;

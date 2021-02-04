import React, { Component } from "react";
import { AppBar, Box, IconButton, List, ListItem, ListItemText, Toolbar } from "@material-ui/core";
import { Home } from "@material-ui/icons";
import { styled } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

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

const StyledLink = styled(Link)({
  textDecoration: "none",
  color: "white"
});

class Header extends Component {
  render() {
    return (
      <AppBar position="static">
        <Toolbar>
          <HeaderBox>
            <IconButton edge="start" color="inherit" aria-label="home">
              <StyledLink to="/bp/">
                <Home fontSize="large" />
              </StyledLink>
            </IconButton>
            <List component="nav" aria-labelledby="main navigation">
              <LinkBox>
                {navLinks.map(({ title, path }) => (
                  <StyledLink key={title} to={path}>
                    <ListItem button>
                      <ListItemText primary={title} />
                    </ListItem>
                  </StyledLink>
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

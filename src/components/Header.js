import * as React from "react";
import { AppBar, IconButton, List, ListItem, ListItemText, Toolbar } from "@material-ui/core";
import { Home } from "@material-ui/icons";

const navLinks = [
  { title: "Learn", path: "/learn" },
  { title: "Research", path: "/research" },
  { title: "Study", path: "/study" },
  { title: "About Us", path: "/about-us" },
];

const Header = () => (
  <AppBar position="static">
    <Toolbar>
      <IconButton edge="start" color="inherit" aria-label="home">
        <Home fontSize="large" />
      </IconButton>
      <List component="nav" aria-labelledby="main navigation">
        {navLinks.map(({ title, path }) => (
          <a href={path} key={title}>
            <ListItem button>
              <ListItemText primary={title} />
            </ListItem>
          </a>
        ))}
      </List>
    </Toolbar>
  </AppBar>
);
export default Header;

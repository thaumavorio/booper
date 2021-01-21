import React, {Component} from "react";
import { AppBar, IconButton, List, ListItem, ListItemText, Toolbar } from "@material-ui/core";
import { Home } from "@material-ui/icons";
import { Link } from "react-router-dom";

const navLinks = [
  { title: "Learn", path: "/learn" },
  { title: "Research", path: "/research" },
  { title: "Study", path: "/study" },
  { title: "About Us", path: "/about-us" },
];

class Header extends Component {
  
  render() {
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="home">
            <Link to="/">
              <Home fontSize="large" />
            </Link>
          </IconButton>
          <List component="nav" aria-labelledby="main navigation">
            {navLinks.map(({ title, path }) => (
              <ListItem key={title}>
                <Link to={path}>
                  <ListItemText primary={title} />
                </Link>
              </ListItem>
            ))}
          </List>
        </Toolbar>
      </AppBar>
    );
  }
}
export default Header;

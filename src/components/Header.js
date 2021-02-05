import React, { Component } from "react";
import {AppBar, Box, IconButton, List, ListItem, ListItemText, Toolbar, Typography} from "@material-ui/core";
import { Home } from "@material-ui/icons";
import { styled } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
// import { Switch } from "@material-ui/core";
import PropTypes from "prop-types";

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

  constructor(props) {
    super(props);
    this.state = {
      darkMode: true
    };
  }

  updateTheme(){
    this.props.sendTheme(this.state.darkMode);
  }

  toggleAlgorithmChoice = (event, value) => {
    // value is true when the user engages the switch to choose the greedy algorithm, false otherwise
    this.setState({
      darkMode: !value
    });
    this.updateTheme();
  }

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
          </HeaderBox>
        </Toolbar>
      </AppBar>
    );
  }
}

// <Switch color="secondary" onChange={this.toggleAlgorithmChoice}/>
// { this.state.darkMode ? "Dark" : "Light" }

Header.propTypes = {
  sendTheme: PropTypes.func
};

export default Header;

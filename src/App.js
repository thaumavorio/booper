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
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./page_components/Home";
import Study from "./page_components/Study.js";
import AboutUs from "./page_components/AboutUs";
import Header from "./components/Header";
import { MuiThemeProvider } from "@material-ui/core/styles";
import darkTheme from "./utils/darkTheme";
import lightTheme from "./utils/lightTheme";

class App extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      darkTheme: true
    };
  }

  getTheme = (event) => {
    this.setState({
      darkTheme: !event
    });
    return event;
  }

  render(){
    return(
      <Router>
        <MuiThemeProvider theme={this.state.darkTheme ? darkTheme : lightTheme}>
          <Header sendTheme={this.getTheme}/>
          <div className="App">
            <Switch>
              <Route exact path="/bp/">
                <Home />
              </Route>
              <Route path="/bp/study">
                <Study />
              </Route>
              <Route path="/bp/about-us">
                <AboutUs />
              </Route>
            </Switch>
          </div>
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default App;

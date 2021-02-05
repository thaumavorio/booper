import "./App.css";
import React from "react";
import { RemoveScrollBar } from "react-remove-scroll-bar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./page_components/Home";
import Learn from "./page_components/Learn";
import Research from "./page_components/Research";
import Study from "./page_components/Study.js";
import AboutUs from "./page_components/AboutUs";
import Header from "./components/Header";
import {MuiThemeProvider} from "@material-ui/core/styles";
import darkTheme from "./utils/darkTheme";

class App extends React.Component{

  getTheme = (event, value) => value

  render(){
    return(
      <Router>
        <MuiThemeProvider theme={darkTheme}>
          <Header sendTheme={this.getTheme}/>
          <div className="App">
            <RemoveScrollBar />
            <Switch>
              <Route exact path="/bp/">
                <Home />
              </Route>
              <Route path="/bp/learn">
                <Learn />
              </Route>
              <Route path="/bp/research">
                <Research />
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

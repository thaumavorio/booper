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
import { RemoveScrollBar } from "react-remove-scroll-bar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./page_components/Home";
import Learn from "./page_components/Learn";
import Research from "./page_components/Research";
import Study from "./page_components/Study.js";
import AboutUs from "./page_components/AboutUs";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <Header />
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
    </Router>
  );
}

export default App;

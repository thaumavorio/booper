import "./App.css";
import React from "react";
import ForceGraph from "./components/ForceGraph.js";
import { RemoveScrollBar } from "react-remove-scroll-bar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";


function App() {
  return (
    <Router>
      <div className="App">
        <RemoveScrollBar />
        <Switch>
          <Route path="/study">
            <ForceGraph />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

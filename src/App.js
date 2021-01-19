import "./App.css";
import React from "react";
import ForceGraph from "./components/ForceGraph.js";
import { RemoveScrollBar } from "react-remove-scroll-bar";

function App() {
  return (
    <div className="App">
      <RemoveScrollBar />
      <ForceGraph />
    </div>
  );
}

export default App;

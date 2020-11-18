import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import ForceGraph from './graphs/ForceGraph.js';
import Graph from './graphs/Graph.js';



function App() {
  return (
    <div className="App">
      <ForceGraph />
    </div>
  );
}



export default App;

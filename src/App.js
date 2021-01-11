import './App.css';
import React from 'react';
import ForceGraph from './components/ForceGraph.js';
import { Box, CssBaseline } from "@material-ui/core";
import {RemoveScrollBar} from 'react-remove-scroll-bar';
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./utils/theme";

function App() {
    return (
    <div className="App">
        <RemoveScrollBar />
        <ForceGraph/>
    </div>
  );
}

export default App;

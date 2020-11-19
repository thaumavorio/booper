import './App.css';
import React from 'react';
import ForceGraph from './graphs/ForceGraph.js';
import { Box, CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./utils/theme";

function App() {
    return (
    <div className="App">
        <ThemeProvider theme={theme}>
            <CssBaseline />
                <ForceGraph/>
        </ThemeProvider>
    </div>
  );
}

export default App;

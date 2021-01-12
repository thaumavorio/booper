import "./App.css";
import React from "react";
import ForceGraph from "./graphs/ForceGraph.js";
import { CssBaseline } from "@material-ui/core";
import { RemoveScrollBar } from "react-remove-scroll-bar";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./utils/theme";

function App() {
  return (
    <div className="App">
      <RemoveScrollBar />
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <ForceGraph />
      </ThemeProvider>
    </div>
  );
}

export default App;

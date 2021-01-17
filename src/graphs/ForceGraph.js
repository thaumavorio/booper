import * as React from "react";
import ForceGraph2D from "react-force-graph-2d";
import Graph from "./Graph";
import update from "immutability-helper";
import { Box, Button, ButtonGroup, Dialog, DialogTitle, DialogContent, Divider, IconButton, Paper, Tooltip, Typography } from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";
import { trackPromise } from "react-promise-tracker";
import { LoadingSpinnerComponent } from "../utils/LoadingSpinnerComponent";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import LastPageIcon from "@material-ui/icons/LastPage";

const initGraph = (() => {
  const graph = new Graph();

  graph.addVertex(0);
  graph.addVertex(1);
  graph.addVertex(2);
  graph.addVertex(3);
  graph.addVertex(4);
  graph.addVertex(5);
  graph.addVertex(6);

  graph.activateVertex(1);
  graph.activateVertex(2);

  graph.addEdge(0, 1);
  graph.addEdge(0, 2);
  graph.addEdge(1, 4);
  graph.addEdge(2, 3);
  graph.addEdge(2, 4);
  graph.addEdge(2, 5);
  graph.addEdge(3, 6);
  graph.addEdge(4, 5);

  return graph;
})();

class ForceGraph extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      graph: initGraph,
      forceData: initGraph.getGraphData(),
      helpOpen: false,
      windowSize: {
        height: window.innerHeight,
        width: window.innerWidth
      },
      bootstrapPercolationThreshold: 2,
      bootstrapPercolationIteration: 0,
      activeVerticesCount: initGraph.getActiveVerticesCount()
    };

    this.updateBootstrapPercolationThreshold = this.updateBootstrapPercolationThreshold.bind(this);
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  updateDimensions() {
    this.setState({
      windowSize: {height: window.innerHeight, width: window.innerWidth},
    });
  }

  helpIconOpen = () => {
    this.setState({helpOpen: true});
  }

  helpIconClose = () => {
    this.setState({helpOpen: false});
  }

  readAdjacencyMatrix = (evt) => {
    const file = evt.target.files[0];
    document.getElementById("uploadAdjacencyMatrix").value = null;
    const reader = new FileReader();
    reader.onload = (event) => {
      // Parse input file.
      const string = event.target.result.trim();
      const matrix = string.split("\n");
      for(const i in matrix) {
        matrix[i] = matrix[i].trim().split(",");
      }
      if(ForceGraph.hasValidShape(matrix) && ForceGraph.hasValidEntries(matrix) && ForceGraph.representsValidGraph(matrix)) {
        // Create a graph according to the adjacency matrix.
        const graph = new Graph();
        for(let i = 0; i < matrix.length - 1; i++) {
          graph.addVertex(i);
          if(matrix[0][i] === "+") {
            graph.activateVertex(i);
          }
          for(let j = 0; j < i; j++) {
            if(matrix[i + 1][j] === "1") {
              graph.addEdge(i, j);
            }
          }
        }
        this.setState({
          graph,
          forceData: graph.getGraphData(),
          bootstrapPercolationIteration: 0,
          activeVerticesCount: graph.getActiveVerticesCount()
        });
      }
    };
    reader.readAsText(file);
  }

  static hasValidShape(matrix) {
    for(const r of matrix) {
      if(r.length !== matrix[0].length) {
        window.alert("Invalid input. Each row must have the same length.");
        return false;
      }
    }
    if(matrix.length !== matrix[0].length + 1) {
      window.alert("Invalid input. The adjacency matrix must be a square matrix.");
      return false;
    }
    return true;
  }
  
  static hasValidEntries(matrix) {
    for(const c of matrix[0]) {
      if(c !== "+" && c !== "-") {
        window.alert("Invalid input. There must be a row of +'s and -'s above the adjacency matrix, indicating which vertices are seeds.");
        return false;
      }
    }
    for(let i = 0; i < matrix.length - 1; i++) {
      for(let j = 0; j < matrix.length - 1; j++) {
        if(matrix[i + 1][j] !== "0" && matrix[i + 1][j] !== "1") {
          window.alert("Invalid input. Every entry in the adjacency matrix must be 1 or 0, indicating the presence or absence of an edge, respectively.");
          return false;
        }
      }
    }
    return true;
  }
    
  static representsValidGraph(matrix) {
    for(let i = 0; i < matrix.length - 1; i++) {
      for(let j = 0; j < i; j++) {
        if(matrix[i + 1][j] !== matrix[j + 1][i]) {
          window.alert("Invalid input. The adjacency matrix must be symmetric, defining an undirected graph.");
          return false;
        }
      }
    }
    for(let i = 0; i < matrix.length - 1; i++) {
      if(matrix[i + 1][i] !== "0") {
        window.alert("Invalid input. The adjacency matrix must have 0's on the diagonal, defining a simple graph.");
        return false;
      }
    }
    return true;
  }

  getMinContagiousSet = () => {
    trackPromise(
      this.state.graph.findMinimalContagiousSet(this.state.bootstrapPercolationThreshold)
        .then(infectedVerts => this.setState(function(state){
          const g = update(state.graph, {$set: state.graph.deactivateAllVertices()});
          g.activateVertices(infectedVerts);
          return {
            graph: g,
            forceData: g.getGraphData(state.forceData),
            bootstrapPercolationIteration: 0,
            activeVerticesCount: g.getActiveVerticesCount() };
        })));
  };

  getGreedyContagiousSet = () => {
    trackPromise(
      this.state.graph.findContagiousSetGreedily(this.state.bootstrapPercolationThreshold)
        .then(infectedVerts => this.setState(function(state){
          const g = update(state.graph, {$set: state.graph.deactivateAllVertices()});
          g.activateVertices(infectedVerts);
          return {
            graph: g,
            forceData: g.getGraphData(state.forceData),
            bootstrapPercolationIteration: 0,
            activeVerticesCount: g.getActiveVerticesCount()};
        })));
  };

  randomSeedSet = () => {
    const inclusionProbability = parseFloat(document.getElementById("seed-probability").value);
    if(!isNaN(inclusionProbability)) {
      this.setState(function(state) {
        const g = update(state.graph, {$set: state.graph.randomSeedSet(inclusionProbability)});
        return {
          graph: g,
          forceData: g.getGraphData(state.forceData),
          bootstrapPercolationIteration: 0,
          activeVerticesCount: g.getActiveVerticesCount()
        };
      });
    }
  }

  resetInfections = () => {
    this.state.graph.deactivateAllVertices();
    this.setState(state => ({
      forceData: state.graph.getGraphData(state.forceData),
      bootstrapPercolationIteration: 0,
      activeVerticesCount: 0
    })
    );
  };

  percolationIteration = () => {
    const g = update(this.state.graph, {$set: this.state.graph.bootstrapPercolationIteration(this.state.bootstrapPercolationThreshold)});
    this.setState(state => ({
      graph: g,
      forceData: g.getGraphData(state.forceData),
      bootstrapPercolationIteration: state.bootstrapPercolationIteration + 1,
      activeVerticesCount: g.getActiveVerticesCount()
    })
    );
  }

  finalPercolationIteration = () => {
    this.setState(state => {
      const g = state.graph;
      let prevActive = -1;
      let itrs = state.bootstrapPercolationIteration;

      while (prevActive !== g.getActiveVerticesCount()) {
        prevActive = g.getActiveVerticesCount();
        g.bootstrapPercolationIteration(state.bootstrapPercolationThreshold);
        itrs = itrs + 1;
      }

      return {
        graph: g,
        forceData: g.getGraphData(state.forceData),
        bootstrapPercolationIteration: itrs,
        activeVerticesCount: g.getActiveVerticesCount()
      };
    });
  }

  updateBootstrapPercolationThreshold = (evt) => {
    const newThreshold = evt.target.value;
    this.setState({
      bootstrapPercolationThreshold: newThreshold,
    });
  }

  stopPropagation = (event) => {
    event.stopPropagation();
  }

  render() {
    const TOOLBAR_WIDTH = 300;
    const INACTIVE_COLOR = "#5375e2";
    const ACTIVE_COLOR = "#f65868";
    const RECENTLY_INFECTED_COLOR = "#228b22";
    const BACKGROUND_COLOR = "#fefefe";
    const TOOLBAR_COLOR = "#f5f5f5";
    return <div>
      <Box display="flex" flexDirection="row" alignItems="center" position="relative" style={{backgroundColor: BACKGROUND_COLOR}}>
        <LoadingSpinnerComponent />
        <Paper elevation={10} style={{margin: 20, backgroundColor: TOOLBAR_COLOR}}>
          <Box component="span" display="flex" flexDirection="column" flexWrap="wrap" style={{padding: 10, justifyContent: "center"}} width={TOOLBAR_WIDTH}>
            <h3>GRAPH</h3>
            <Box display="flex" flexDirection="row" style={{margin: 10, marginTop: 0}}>
              <Button variant="outlined" component="label">
                <Typography variant="button">Upload Adjacency Matrix</Typography>
                <input id="uploadAdjacencyMatrix" type="file" accept=".csv" onChange={this.readAdjacencyMatrix} hidden />
              </Button>
              <IconButton color="Info" variant="contained" component="label" onClick={this.helpIconOpen}>
                <HelpIcon/>
              </IconButton>
              <Dialog onClose={this.helpIconClose} open={this.state.helpOpen}>
                <DialogTitle id="customized-dialog-title" onClose={this.helpIconClose}>
                  Uploading Adjacency Matrices
                </DialogTitle>
                <DialogContent dividers>
                  <Typography gutterBottom>
                    The adjacency matrix input should be in the format of a .csv file. The first row should contain
                    either a &lsquo;+&rsquo; or a &lsquo;-&rsquo;, indicating whether the node is initially infected or not, respectively.
                  </Typography>
                  <Typography gutterBottom>
                    The adjacency matrix starts the row after, and this follows the normal format for an adjacency matrix.
                  </Typography>
                  <Typography gutterBottom>
                    An example of an adjacency matrix input is available below:
                  </Typography>
                  <Typography gutterBottom>
                    <a href="example_graph.csv" download>Example Adjacency Matrix Input</a>
                  </Typography>
                </DialogContent>
              </Dialog>
            </Box>
            <Divider variant = "middle" color = "Primary"/>
            <h3>SEED SETS</h3>
            <Box display="flex" flexDirection="column" alignItems="center">
              <ButtonGroup
                orientation="horizontal"
                aria-label = "horizontal contained primary button group"
                variant = "contained"
                style = {{margin: 10, marginTop: 0}}
              >
                <Tooltip title={"Calculates and displays the smallest set of nodes needed to activate the entire graph."}>
                  <Button style={{ fontSize: "12px" }} variant="outlined" onClick={this.getMinContagiousSet}>
                    <Typography variant="button">Minimum Contagious Set</Typography>
                  </Button>
                </Tooltip>
                <Tooltip title={"Calculates and displays a set of nodes which would activate the entire graph using a greedy algorithm."}>
                  <Button style={{ fontSize: "12px" }} variant="outlined" onClick={this.getGreedyContagiousSet}>
                    <Typography variant="button">Greedy Contagious Set</Typography>
                  </Button>
                </Tooltip>
              </ButtonGroup>
              <Tooltip title={"Makes each node a seed independently at random with the given probability."}>
                <Button style={{ margin: 10, marginRight: 0 }} color = "Primary" variant="outlined" onClick={this.randomSeedSet}>
                  <Typography style={{ padding: 5 }} variant="button">Random Seed Set</Typography>
                </Button>
              </Tooltip>
            </Box>
            <Box display="flex" flexDirection="row" alignContent="center" style={{justifyContent: "center"}}>
              <Typography variant="overline">Seed Probability:</Typography>
              <input style={{ width: 100, height: 30, marginLeft: 5, marginBottom: 10}} placeholder="Specify p" id="seed-probability" type="number" min="0.00000000000" max="1.00000000000" onClick={this.stopPropagation} />
            </Box>
            <Divider variant = "middle" color = "Primary"/>
            <h3>BOOTSTRAP PERCOLATION</h3>
            <Box display="flex" flexDirection="column" alignItems="center" style={{justifyContent: "center"}}>
              <ButtonGroup
                orientation="horizontal"
                aria-label = "horizontal contained primary button group"
              >
                <Tooltip title={"Deactivate all vertices"}>
                  <IconButton onClick={this.resetInfections}>
                    <RotateLeftIcon/>
                  </IconButton>
                </Tooltip>
                <Tooltip title={"Return to the first iteration"}>
                  <IconButton disabled={true}>
                    <FirstPageIcon/>
                  </IconButton>
                </Tooltip>
                <Tooltip title={"Go back an iteration"}>
                  <IconButton disabled={true}>
                    <ChevronLeftIcon/>
                  </IconButton>
                </Tooltip>
                <Tooltip title={"Perform a single iteration"}>
                  <IconButton onClick={this.percolationIteration}>
                    <ChevronRightIcon/>
                  </IconButton>
                </Tooltip>
                <Tooltip title={"Skip to the final iteration"}>
                  <IconButton onClick={this.finalPercolationIteration}>
                    <LastPageIcon/>
                  </IconButton>
                </Tooltip>
              </ButtonGroup>
              <Box display="flex" flexDirection="row" alignItems="center" style={{ padding:10, justifyContent: "center" }}>
                <Typography variant="overline" gutterBottom>Threshold: </Typography>
                <div className="input-thresh">
                  <input style={{ width: 100, height: 30, marginLeft: 5, marginBottom: 10}} id="bootstrap-percolation-threshold" type="number" min="1" onChange={this.updateBootstrapPercolationThreshold} defaultValue={this.state.bootstrapPercolationThreshold}  />
                </div>
              </Box>
              <Typography variant="subtitle1" gutterBottom>Iteration: {this.state.bootstrapPercolationIteration}</Typography>
              <Typography variant="subtitle1" gutterBottom>Active Vertices: {this.state.activeVerticesCount}</Typography>
              <Typography variant="subtitle1" gutterBottom>Inactive Vertices: {this.state.forceData.nodes.length - this.state.activeVerticesCount}</Typography>
            </Box>
            <Divider variant = "middle" color = "Primary"/>
            <h3 style={{marginBottom: 5}}>LEGEND</h3>
            <div style={{textAlign:"left", marginLeft:TOOLBAR_WIDTH / 2 - 100}}>
              <div style={{width:"10px", height:"10px", backgroundColor:INACTIVE_COLOR, borderRadius:"50%", display:"inline-block"}}></div>
                &nbsp;<Typography variant="overline" gutterBottom>Inactive Node</Typography>
              <br/>
              <div style={{width:"10px", height:"10px", backgroundColor:ACTIVE_COLOR, borderRadius:"50%", display:"inline-block"}}></div>
                &nbsp;<Typography variant="overline" gutterBottom>Active Node</Typography>
              <br/>
              <div style={{width:"10px", height:"10px", backgroundColor:RECENTLY_INFECTED_COLOR, borderRadius:"50%", display:"inline-block"}}></div>
                &nbsp;<Typography variant="overline" gutterBottom>Recently Infected Node</Typography>
            </div>
          </Box>
        </Paper>
        <ForceGraph2D graphData={this.state.forceData}
          nodeColor={d => d.recentlyInfected ? RECENTLY_INFECTED_COLOR : d.active ? ACTIVE_COLOR : INACTIVE_COLOR}
          linkColor="#5c616e"
          linkOpacity={0.7}
          linkWidth={3.5}
          backgroundColor={BACKGROUND_COLOR}
          width={this.state.windowSize.width - TOOLBAR_WIDTH}
          height={this.state.windowSize.height}
        />
      </Box>
    </div>;
  }
}

export default ForceGraph;

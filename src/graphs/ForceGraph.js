import * as React from "react";
import ForceGraph2D from 'react-force-graph-2d';
import Graph from "./Graph";
import update from 'immutability-helper';
import { Box, Button, ButtonGroup, Dialog, DialogTitle, DialogContent, Divider, IconButton, Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HelpIcon from '@material-ui/icons/Help';



let graphs = setUpGraphs();
let graph1 = graphs[0];
let graph2 = graphs[1];
let graph3 = graphs[2];

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

class ForceGraph extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            graph: graph1,
            forceData: graph1.getGraphData(),
            helpOpen: false,
            windowSize: {
                height: window.innerHeight,
                width: window.innerWidth
            },
            bootstrapPercolationThreshold: 2,
            bootstrapPercolationIteration: 0
        };

        this.updateBootstrapPercolationThreshold = this.updateBootstrapPercolationThreshold.bind(this)
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    updateDimensions() {
        this.setState(state => ({
          graph: state.graph,
          forceData: state.forceData,
          windowSize: {height: window.innerHeight, width: window.innerWidth},
          bootstrapPercolationIteration: state.bootstrapPercolationIteration,
          bootstrapPercolationThreshold: state.bootstrapPercolationThreshold
        }));
    }

    helpIconOpen = () => {
        this.setState({helpOpen: true})
    }

    helpIconClose = () => {
        this.setState({helpOpen: false})
    }

    readAdjacencyMatrix = (evt) => {
        const file = evt.target.files[0];
        document.getElementById("uploadAdjacencyMatrix").value = null;
        const reader = new FileReader();
        reader.onload = (event) => {
            // Parse input file.
            const string = event.target.result;
            const matrix = string.split('\n');
            for(var i in matrix) {
                matrix[i] = matrix[i].trim().split(',');
            }

            // Check for invalid input.
            for(var c of matrix[0]) {
                if(c !== '+' && c !== '-') {
                    window.alert("Invalid input. There must be a row of +'s and -'s above the adjacency matrix, indicating which vertices are seeds.");
                    return;
                }
            }
            for(var r of matrix) {
                if(r.length !== matrix[0].length) {
                    window.alert("Invalid input. Each row must have the same length.");
                    return;
                }
            };
            if(matrix.length !== matrix[0].length + 1) {
                window.alert("Invalid input. The adjacency matrix must be a square matrix.");
                return;
            }
            for(i = 0; i < matrix.length - 1; i++) {
                for(var j = 0; j < matrix.length - 1; j++) {
                    if(matrix[i + 1][j] !== '0' && matrix[i + 1][j] !== '1') {
                        window.alert("Invalid input. Every entry in the adjacency matrix must be 1 or 0, indicating the presence or absence of an edge, respectively.");
                        return;
                    }
                }
            }
            for(i = 0; i < matrix.length - 1; i++) {
                for(j = 0; j < i; j++) {
                    if(matrix[i + 1][j] !== matrix[j + 1][i]) {
                        window.alert("Invalid input. The adjacency matrix must be symmetric, defining an undirected graph.");
                        return;
                    }
                }
            }
            for(i = 0; i < matrix.length - 1; i++) {
                if(matrix[i + 1][i] !== '0') {
                    if(matrix[i + 1][i] !== '0') {
                        window.alert("Invalid input. The adjacency matrix must have 0's on the diagonal, defining a simple graph.");
                        return;
                    }
                }
            }

            // Create a graph according to the adjacency matrix.
            const graph = new Graph();
            for(i = 0; i < matrix.length - 1; i++) {
                graph.addVertex(i);
                if(matrix[0][i] === '+') {
                    graph.activateVertex(i);
                }
                for(j = 0; j < i; j++) {
                    if(matrix[i + 1][j] === '1') {
                        graph.addEdge(i, j);
                    }
                }
            }
            this.setState(state => ({
              graph: graph,
              forceData: graph.getGraphData(),
              windowSize: { height: window.innerHeight, width: window.innerWidth },
              bootstrapPercolationIteration: 0,
              bootstrapPercolationThreshold: state.bootstrapPercolationThreshold }));
        };
        reader.readAsText(file);
    }

  getMinContagiousSet = () => {
    this.state.graph.findMinimalContagiousSet(this.state.bootstrapPercolationThreshold)
          .then(infectedVerts => this.setState(function(state){
            const g = update(state.graph, {$set: state.graph.deactivateAllVertices()});
            g.activateVertices(infectedVerts);
            return {
              graph: g,
              forceData: g.getGraphData(state.forceData),
              windowSize: { height: window.innerHeight, width: window.innerWidth },
              bootstrapPercolationIteration: 0,
              bootstrapPercolationThreshold: state.bootstrapPercolationThreshold };
          }));
    };

  getGreedyContagiousSet = () => {
        this.state.graph.findContagiousSetGreedily(this.state.bootstrapPercolationThreshold)
            .then(infectedVerts => this.setState(function(state){
                const g = update(state.graph, {$set: state.graph.deactivateAllVertices()});
                g.activateVertices(infectedVerts);
                return {
                  graph: g,
                  forceData: g.getGraphData(state.forceData),
                  windowSize: { height: window.innerHeight, width: window.innerWidth },
                  bootstrapPercolationIteration: 0,
                  bootstrapPercolationThreshold: state.bootstrapPercolationThreshold };
            }));
    };

  resetInfections = () => {
    this.state.graph.deactivateAllVertices();
    this.setState(state => ({
              graph: state.graph,
              forceData: state.graph.getGraphData(state.forceData),
              windowSize: { height: window.innerHeight, width: window.innerWidth },
              bootstrapPercolationIteration: 0,
              bootstrapPercolationThreshold: state.bootstrapPercolationThreshold })
    );
  };

  percolationIteration = () => {
      const g = update(this.state.graph, {$set: this.state.graph.bootstrapPercolationIteration(2)})
      this.setState(state => ({
              graph: g,
              forceData: g.getGraphData(state.forceData),
              windowSize: { height: window.innerHeight, width: window.innerWidth },
              bootstrapPercolationIteration: state.bootstrapPercolationIteration + 1,
              bootstrapPercolationThreshold: state.bootstrapPercolationThreshold })
      );
  }

  updateBootstrapPercolationThreshold = (evt) => {
    const newThreshold = evt.target.value
    this.setState(state => ({
      graph: state.graph,
      forceData: state.forceData,
      windowSize: { height: window.innerHeight, width: window.innerWidth },
      bootstrapPercolationIteration: state.bootstrapPercolationIteration,
      bootstrapPercolationThreshold: newThreshold }))
  }

  render() {
      const TOOLBAR_WIDTH = 300;
      return <div>
          <Box display="flex" flexDirection="row">
              <Box component="span" display="flex" flexDirection="column" flexWrap="wrap" alignContent="center" color="Secondary" m={1} p={1} width={TOOLBAR_WIDTH}>
                  <br/>
                  <br/>
                  <h3>GRAPH</h3>
                  <Box display="flex" flexDirection="row">
                  <Button color = "Primary" variant="outlined" component="label">
                      Upload Adjacency Matrix
                      <input id="uploadAdjacencyMatrix" type="file" accept=".csv" onChange={this.readAdjacencyMatrix} hidden />
                  </Button>
                  <IconButton color="info" variant="contained" component="label" onClick={this.helpIconOpen}>
                      <HelpIcon/>
                  </IconButton>
                  <Dialog onClose={this.helpIconClose} open={this.state.helpOpen}>
                  <DialogTitle id="customized-dialog-title" onClose={this.helpIconClose}>
                      Uploading Adjacency Matrices
                  </DialogTitle>
                  <DialogContent dividers>
                      <Typography gutterBottom>
                          The adjacency matrix input should be in the format of a .csv file. The first row should contain
                          either a '+' or a '-', indicating whether the node is initially infected or not, respectively.
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
                  <br/>
                  <br/>
                  <Divider variant = "middle" color = "Secondary"/>
                  <br/>
                  <h3>CONTAGIOUS SETS</h3>
                  <ButtonGroup
                      orientation="horizontal"
                      color = "Primary"
                      aria-label = "horizontal outlined primary button group"
                      variant = "outlined"
                  >
                  <Tooltip title={"Calculates and displays the smallest set of nodes needed to activate the entire graph."}>
                      <Button style={{ fontSize: '12px' }} color = "Primary" onClick={this.getMinContagiousSet}>Minimum Contagious Set</Button>
                  </Tooltip>
                  <Tooltip title={"Calculates and displays the smallest set of nodes needed to activate the entire graph using a greedy algorithm."}>
                      <Button style={{ fontSize: '12px' }} color = "Primary" onClick={this.getGreedyContagiousSet}>Greedy Contagious Set</Button>
                  </Tooltip>
                  </ButtonGroup>
                  <br/>
                  <br/>
                  <Divider variant = "middle" color = "Secondary"/>
                  <br/>
                  <br/>
                  <h3>BOOTSTRAP PERCOLATION</h3>
                  <div class="input-thresh">
                    <label for="bootstrap-percolation-threshold">Threshold:</label>
                    <input id="bootstrap-percolation-threshold" type="number" min="1" onChange={this.updateBootstrapPercolationThreshold} defaultValue={this.state.bootstrapPercolationThreshold}  />
                  </div>
                  Iteration: {this.state.bootstrapPercolationIteration}
                  <ButtonGroup
                      orientation="horizontal"
                      color = "Primary"
                      aria-label = "horizontal outlined primary button group"
                      variant = "outlined"
                  >
                  <Tooltip title={"Deactivate all vertices"}>
                      <Button fullWidth={true} style={{ fontSize: '12px' }}  color = "Primary" variant="outlined" onClick={this.resetInfections}>Reset</Button>
                  </Tooltip>
                  <Tooltip title={"Activates any vertex with 2 or more activated neighbors. This is an iterative process."}>
                      <Button fullWidth={true} style={{ fontSize: '12px' }}  color = "Primary" variant="outlined" onClick={this.percolationIteration}>Percolation Step</Button>
                  </Tooltip>
                  </ButtonGroup>
              </Box>
              <ForceGraph2D graphData={this.state.forceData}
                    nodeColor={d => d.infected ? "#f65868" : "#5375e2"}
                    linkColor="#5c616e"
                    linkOpacity={0.7}
                    linkWidth={3.5}
                    backgroundColor="#fefefe"
                    width={this.state.windowSize.width - TOOLBAR_WIDTH}
                    height={this.state.windowSize.height}
              />
          </Box>
      </div>;
  }


  }

function setUpGraphs(){
    let graph1 = new Graph();
    graph1.addVertex(0);
    graph1.addVertex(1);
    graph1.addVertex(2);
    graph1.addVertex(3);
    graph1.addVertex(4);
    graph1.addVertex(5);
    graph1.addVertex(6);

    graph1.activateVertex(1);
    graph1.activateVertex(2);

    graph1.addEdge(0, 1);
    graph1.addEdge(0, 2);
    graph1.addEdge(1, 4);
    graph1.addEdge(2, 3);
    graph1.addEdge(2, 4);
    graph1.addEdge(2, 5);
    graph1.addEdge(3, 6);
    graph1.addEdge(4, 5);

    let graph2 = new Graph();
    graph2.addVertex(0);
    graph2.addVertex(1);
    graph2.addVertex(2);
    graph2.addVertex(3);
    graph2.addVertex(4);
    graph2.addVertex(5);
    graph2.addVertex(6);

    graph2.activateVertex(0);
    graph2.activateVertex(1);
    graph2.activateVertex(5);
    graph2.activateVertex(6);

    graph2.addEdge(0, 3);
    graph2.addEdge(1, 2);
    graph2.addEdge(1, 4);
    graph2.addEdge(2, 4);
    graph2.addEdge(2, 3);
    graph2.addEdge(2, 5);
    graph2.addEdge(3, 6);

    let graph3 = new Graph();
    graph3.addVertex(0);
    graph3.addVertex(1);
    graph3.addVertex(2);
    graph3.addVertex(3);
    graph3.addVertex(4);
    graph3.addVertex(5);
    graph3.addVertex(6);

    graph3.addEdge(0, 1);
    graph3.addEdge(0, 2);
    graph3.addEdge(1, 5);
    graph3.addEdge(2, 3);
    graph3.addEdge(2, 4);
    graph3.addEdge(2, 5);
    graph3.addEdge(2, 6);
    graph3.addEdge(3, 6);
    graph3.addEdge(4, 2);
    graph3.addEdge(5, 6);

    return [graph1, graph2, graph3];
}


export default ForceGraph;

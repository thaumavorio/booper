import * as React from "react";
import ForceGraph2D from 'react-force-graph-2d';
import Graph from "../classes/Graph";
import update from 'immutability-helper';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import GraphTaskbar from "./GraphTaskbar";


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
            windowSize: {
                height: window.innerHeight,
                width: window.innerWidth
            },
            bootstrapPercolationThreshold: 2,
            bootstrapPercolationIteration: 0,
            activeVerticesCount: graph1.getActiveVerticesCount()
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
          bootstrapPercolationThreshold: state.bootstrapPercolationThreshold,
          activeVerticesCount: state.activeVerticesCount
        }));
    }

    readAdjacencyMatrix = (evt) => {
        const file = evt.target.files[0];
        document.getElementById("uploadAdjacencyMatrix").value = null;
        const reader = new FileReader();
        reader.onload = (event) => {
            // Parse input file.
            const string = event.target.result.trim();
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
              bootstrapPercolationThreshold: state.bootstrapPercolationThreshold,
              activeVerticesCount: graph.getActiveVerticesCount()}));
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
              bootstrapPercolationThreshold: state.bootstrapPercolationThreshold,
              activeVerticesCount: g.getActiveVerticesCount() };
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
                  bootstrapPercolationThreshold: state.bootstrapPercolationThreshold,
                  activeVerticesCount: g.getActiveVerticesCount()};
            }));
    };

    randomSeedSet = () => {
        const inclusionProbability = parseFloat(document.getElementById("seed-probability").value);
        if(!isNaN(inclusionProbability)) {
            this.setState(function(state) {
                const g = update(state.graph, {$set: state.graph.randomSeedSet(inclusionProbability)});
                return {
                    graph: g,
                    forceData: g.getGraphData(state.forceData),
                    windowSize: state.windowSize,
                    bootstrapPercolationIteration: 0,
                    bootstrapPercolationThreshold: state.bootstrapPercolationThreshold,
                    activeVerticesCount: g.getActiveVerticesCount()
                };
            });
        }
    }

  resetInfections = () => {
    this.state.graph.deactivateAllVertices();
    this.setState(state => ({
              graph: state.graph,
              forceData: state.graph.getGraphData(state.forceData),
              windowSize: { height: window.innerHeight, width: window.innerWidth },
              bootstrapPercolationIteration: 0,
              bootstrapPercolationThreshold: state.bootstrapPercolationThreshold,
              activeVerticesCount: 0 })
    );
  };

  percolationIteration = () => {
      const g = update(this.state.graph, {$set: this.state.graph.bootstrapPercolationIteration(this.state.bootstrapPercolationThreshold)})
      this.setState(state => ({
              graph: g,
              forceData: g.getGraphData(state.forceData),
              windowSize: { height: window.innerHeight, width: window.innerWidth },
              bootstrapPercolationIteration: state.bootstrapPercolationIteration + 1,
              bootstrapPercolationThreshold: state.bootstrapPercolationThreshold,
              activeVerticesCount: g.getActiveVerticesCount()
      })
      );
  }

  finalPercolationIteration = () => {
      this.setState(state => {
          var g = state.graph
          var prevActive = -1
          var itrs = state.bootstrapPercolationIteration

          while (prevActive !== g.getActiveVerticesCount()) {
              prevActive = g.getActiveVerticesCount()
              g.bootstrapPercolationIteration(state.bootstrapPercolationThreshold)
              itrs = itrs + 1
          }

          return {
              graph: g,
              forceData: g.getGraphData(state.forceData),
              windowSize: { height: window.innerHeight, width: window.innerWidth },
              bootstrapPercolationIteration: itrs,
              bootstrapPercolationThreshold: state.bootstrapPercolationThreshold,
              activeVerticesCount: g.getActiveVerticesCount()
          }
      });
  }

  updateBootstrapPercolationThreshold = (evt) => {
    const newThreshold = evt.target.value
    this.setState(state => ({
      graph: state.graph,
      forceData: state.forceData,
      windowSize: { height: window.innerHeight, width: window.innerWidth },
      bootstrapPercolationIteration: state.bootstrapPercolationIteration,
      bootstrapPercolationThreshold: newThreshold,
      activeVerticesCount: state.activeVerticesCount }))
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
          <Box display="flex" flexDirection="row" alignItems="center" style={{backgroundColor: BACKGROUND_COLOR}}>
              <GraphTaskbar readAdjacencyMatrix={this.readAdjacencyMatrix}
                            getMinContagiousSet={this.getMinContagiousSet}
                            getGreedyContagiousSet={this.getGreedyContagiousSet}
                            randomSeedSet={this.randomSeedSet}
                            stopPropagation={this.stopPropagation}
                            resetInfections={this.resetInfections}
                            percolationIteration={this.percolationIteration}
                            finalPercolationIteration={this.finalPercolationIteration}
                            updateBootstrapPercolationThreshold={this.updateBootstrapPercolationThreshold}
                            threshold={this.state.bootstrapPercolationThreshold}
                            iteration={this.state.bootstrapPercolationIteration}
                            activeVerticesCount={this.state.activeVerticesCount}
                            inactiveVerticesCount={this.state.forceData.nodes.length - this.state.activeVerticesCount}/>
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
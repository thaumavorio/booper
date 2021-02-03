import * as React from "react";
import ForceGraph2D from "react-force-graph-2d";
import { forceCollide, forceX, forceY, forceZ } from "d3-force-3d";
import Graph from "../classes/Graph";
import update from "immutability-helper";
import {Box} from "@material-ui/core";
import { trackPromise } from "react-promise-tracker";
import GraphTaskbar from "./GraphTaskbar";
import { withTheme } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {LoadingSpinnerComponent} from "./LoadingSpinnerComponent";

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
      bootstrapPercolationProbability: 1,
      bootstrapPercolationIteration: 0,
      activeVerticesCount: initGraph.getActiveVerticesCount()
    };
    this.updateBootstrapPercolationThreshold = this.updateBootstrapPercolationThreshold.bind(this);

    this.graphRef = React.createRef(null);
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
    const g = update(this.state.graph, {});
    g.bootstrapPercolationIteration(this.state.bootstrapPercolationThreshold, this.state.bootstrapPercolationProbability);
    this.setState(state => ({
      graph: g,
      forceData: g.getGraphData(state.forceData),
      bootstrapPercolationIteration: state.bootstrapPercolationIteration + 1,
      activeVerticesCount: g.getActiveVerticesCount()
    }));
  }

  finalPercolationIteration = () => {
    this.setState(state => {
      const g = update(state.graph, {});
      let itrs = state.bootstrapPercolationIteration;

      while (!g.bootstrapPercolationIteration(state.bootstrapPercolationThreshold, state.bootstrapPercolationProbability)) {
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

  updateBootstrapPercolationProbability = (evt) => {
    const newProbability = evt.target.value;
    if(newProbability !== "") {
      this.setState({
        bootstrapPercolationProbability: newProbability
      });
    }
  }

  stopPropagation = (event) => {
    event.stopPropagation();
  }

  render() {
    const TOOLBAR_WIDTH = 300;
    setTimeout(() => {
      this.graphRef.current.d3Force("collide", forceCollide());
      this.graphRef.current.d3Force("center", null);
      this.graphRef.current.d3Force("x", forceX().strength(0.01));
      this.graphRef.current.d3Force("y", forceY().strength(0.01));
      this.graphRef.current.d3Force("z", forceZ().strength(0.01));
      this.graphRef.current.d3Force("charge").strength(-100);
    }, 100);
    return <div>
      <LoadingSpinnerComponent />
      <Box display="flex" flexDirection="row" alignItems="center" style={{backgroundColor: this.props.theme.palette.background.main}}>
        <GraphTaskbar readAdjacencyMatrix={this.readAdjacencyMatrix}
          getMinContagiousSet={this.getMinContagiousSet}
          getGreedyContagiousSet={this.getGreedyContagiousSet}
          randomSeedSet={this.randomSeedSet}
          stopPropagation={this.stopPropagation}
          resetInfections={this.resetInfections}
          percolationIteration={this.percolationIteration}
          finalPercolationIteration={this.finalPercolationIteration}
          updateBootstrapPercolationThreshold={this.updateBootstrapPercolationThreshold}
          updateBootstrapPercolationProbability={this.updateBootstrapPercolationProbability}
          threshold={this.state.bootstrapPercolationThreshold}
          iteration={this.state.bootstrapPercolationIteration}
          activeVerticesCount={this.state.activeVerticesCount}
          inactiveVerticesCount={this.state.forceData.nodes.length - this.state.activeVerticesCount}
        />
        <ForceGraph2D graphData={this.state.forceData}
          nodeColor={d => d.recentlyInfected ? this.props.theme.palette.recentlyActive.main : d.active ? this.props.theme.palette.active.main : this.props.theme.palette.inactive.main}
          linkColor={() => this.props.theme.palette.link.main}
          backgroundColor={this.props.theme.palette.background.main}
          linkOpacity={0.7}
          linkWidth={3.5}
          width={this.state.windowSize.width - TOOLBAR_WIDTH}
          height={this.state.windowSize.height}
          ref={this.graphRef}
        />
      </Box>
    </div>;
  }
}

ForceGraph.propTypes = {
  theme: PropTypes.shape({
    palette: PropTypes.shape({
      background: PropTypes.shape({
        main: PropTypes.string.isRequired
      }).isRequired,
      active: PropTypes.shape({
        main: PropTypes.string.isRequired
      }).isRequired,
      inactive: PropTypes.shape({
        main: PropTypes.string.isRequired
      }).isRequired,
      link: PropTypes.shape({
        main: PropTypes.string.isRequired
      }).isRequired,
      recentlyActive: PropTypes.shape({
        main: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }).isRequired
};

export default withTheme(ForceGraph);

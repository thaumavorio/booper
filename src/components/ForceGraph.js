import * as React from "react";
import ForceGraph2D from "react-force-graph-2d";
import Graph from "../classes/Graph";
import update from "immutability-helper";
import { Box } from "@material-ui/core";
import { trackPromise } from "react-promise-tracker";
import GraphTaskbar from "./GraphTaskbar";

/**
 * Create the default graph. Users will see this graph in the display pane when they first open the Study tab in Booper.
 * @returns a Graph object
*/
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
  /**
   * Instantiates a ForceGraph component with the default initial state.
   * @param {Object} props not used in this component. Expecting an empty object.
   */
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
  }

  /**
   * Enables the behavior that when the user resizes the browser window, the graph will be re-centered in the display pane.
   */
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  /**
   * Removes the resizing event listener added by @see componentDidMount when it is no longer necessary.
   */
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  /**
   * Re-centers the graph in the display pane if the user has resized the browser window.
   */
  updateDimensions() {
    this.setState({
      windowSize: {height: window.innerHeight, width: window.innerWidth},
    });
  }

  /**
   * Parses an input file that defines a graph. Renders the graph in the display pane.
   * Expects a CSV file in which each row has the same length, and the number of rows is the row length plus one.
   * Each entry in the first row is a '+' or '-' character. Each entry in every other row is either a '0' or '1' character.
   * The resulting graph has one vertex for each column, or one vertex for each row after the first row.
   * A '+' in the first row means that the column's corresponding vertex is a seed. A '-' means it is not a seed.
   * The remaining rows are interpreted as an adjacency matrix.
   * A '1' means that the row's corresponding vertex is adjacent to the column's corresponding vertex. A '0' means that they are not adjacent.
   * Currently, Booper can only render simple, undirected graphs; the input adjacency matrix must be symmetric with 0s on the diagonal.
   * If the input file is invalid according to these rules, an error message will pop up on the screen, and the input graph will not be rendered.
   * @param {Object} evt an object containing the input file
   */
  readAdjacencyMatrix = (evt) => {
    // Extract the input file from its container object.
    const file = evt.target.files[0];
    // Clear the file input component so this method will be called every time a user uploads a file, even if they upload the same file twice.
    document.getElementById("uploadAdjacencyMatrix").value = null;
    const reader = new FileReader();
    reader.onload = (event) => {
      // Parse input file into a 2-D array so each entry is eaily accessible.
      const string = event.target.result.trim();
      const matrix = string.split("\n");
      for(const i in matrix) {
        matrix[i] = matrix[i].trim().split(",");
      }
      if(ForceGraph.hasValidShape(matrix) && ForceGraph.hasValidEntries(matrix) && ForceGraph.representsValidGraph(matrix)) { // check that the input is valid
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
        // Render the graph.
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

  /**
   * Checks that the matrix has a valid shape valid, as defined for @see readAdjacencyMatrix.
   * Each row in the given matrix should have the same length.
   * The number of rows should be the row length plus one.
   * If the matrix does not have a valid shape, an error message will pop up on the screen.
   * @param {Array} matrix a 2-D array
   * @returns true if the matrix has a valid shape, false otherwise
   */
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

  /**
   * Checks that the matrix has valid entries, as defined for @see readAdjacencyMatrix.
   * Each entry in the first row should be a '+' or '-' character.
   * Each entry in every row thereafter should be a '1' or '0' character.
   * If the matrix does not have valid entries, an error message will pop up on the screen.
   * @param {Array} matrix a 2-D array
   * @returns true if the matrix has valid entries, false otherwise
   */
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

  /**
   * Checks that the matrix represents a valid (simple and undirected) graph.
   * Ignoring the first row, the matrix should be symmetric. Each entry on the diagonal should be a '0' character.
   * @param {Array} matrix a 2-D array with a valid shape, as defined by @see hasValidShape
   * @returns true if the matrix represents a valid graph, false otherwise.
   */
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

  /**
   * Finds a minimum contagious set of the currently displayed graph.
   * Sends the graph and treshold in an HTTP request to a server, which performs the algorithm and sends the result in a response object.
   * When the response object is received, the minimum contagious set is rendered.
   */
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

  /**
   * Finds a small contagious set of the currently displayed graph.
   * Sends the graph and treshold in an HTTP request to a server, which performs a greedy algorithm and sends the result in a response object.
   * When the response object is received, the minimum contagious set is rendered.
   */
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

  /**
   * Generates a random seed set for the currently displayed graph.
   * Each vertex becomes a seed independently with the given inclusion probability.
   * Renders the resulting seed set.
   */
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

  /**
   * Deactivates all vertices in the currently displayed graph. Re-renders the graph.
   */
  resetInfections = () => {
    this.state.graph.deactivateAllVertices();
    this.setState(state => ({
      forceData: state.graph.getGraphData(state.forceData),
      bootstrapPercolationIteration: 0,
      activeVerticesCount: 0
    })
    );
  };

  /**
   * Simulates an iteration of bootstrap percolation with the currently displayed graph.
   * Re-renders the graph, showing which vertices were just infected.
   */
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

  /**
   * Simulates bootstrap percolation until no more vertices can be infected.
   * Re-renders the graph, showing which vertices are active at the end.
   * This function might take a long time for low infection probabilities.
   */
  finalPercolationIteration = () => {
    if(this.state.bootstrapPercolationProbability > 0) {
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
  }

  /**
   * Changes the bootstrap percolation threshold.
   * @param {Object} evt an object that contains the new threshold
   */
  updateBootstrapPercolationThreshold = (evt) => {
    const newThreshold = evt.target.value;
    this.setState({
      bootstrapPercolationThreshold: newThreshold,
    });
  }

  /**
   * Changes the infection probability for bootstrap percolation.
   * @param {Object} evt an object that contains the new probability
   */
  updateBootstrapPercolationProbability = (evt) => {
    const newProbability = evt.target.value;
    if(newProbability !== "") {
      this.setState({
        bootstrapPercolationProbability: newProbability
      });
    }
  }

  /**
   * When a component is inside another component and the user clicks on the child component, prevents the parent component from reacting the click.
   * @param {Object} event an event object representing a mouse click
   */
  stopPropagation = (event) => {
    event.stopPropagation();
  }

  render() {
    const TOOLBAR_WIDTH = 300;
    const INACTIVE_COLOR = "#5375e2";
    const ACTIVE_COLOR = "#f65868";
    const RECENTLY_INFECTED_COLOR = "#228b22";
    const BACKGROUND_COLOR = "#fefefe";
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
          updateBootstrapPercolationProbability={this.updateBootstrapPercolationProbability}
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

export default ForceGraph;

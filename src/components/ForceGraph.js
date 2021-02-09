import * as React from "react";
import ForceGraph2D from "react-force-graph-2d";
import { forceCollide, forceX, forceY, forceZ } from "d3-force-3d";
import Graph from "../classes/Graph";
import update from "immutability-helper";
import { Box } from "@material-ui/core";
import { trackPromise } from "react-promise-tracker";
import GraphTaskbar from "./GraphTaskbar";
import Tour from "reactour";

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

const TOUR_STEPS = [
  {
    content: "Welcome our study tool. Here, you can visualize bootstrap percolation on any graph. Let us show you around before you dive in."
  },
  {
    selector: "[data-tour=\"graph-display-pane\"]",
    content: "This is the graph display pane. It shows the graph that is being percolated on. Active vertices are red, and inactive vertices are blue. You can use the mouse to zoom in or out, pan around, or drag the graph around."
  },
  {
    selector: "[data-tour=\"next-iteration-button\"]",
    content: "Here's where you can visualize the percolation. This button performs one iteration of two-neighbor bootstrap percolation. Each inactive vertex that has at least two active neighbors is infected. Try clicking it now, and see what happens in the graph display pane."
  },
  {
    selector: "[data-tour=\"graph-display-pane\"]",
    content: "Vertices that were infected in the most recent iteration are green. All other active vertices are red."
  },
  {
    selector: "[data-tour=\"last-iteration-button\"]",
    content: "This button performs percolation iterations until no more vertices can be infected. Then it shows you the final result."
  },
  {
    selector: "[data-tour=\"parameter-text-fields\"]",
    content: <p>You can modify the parameters of bootstrap percolation. The <b>threshold</b> is the number of active neighbors required to infect an inactive vertex. The <b>probability</b> is the probability that an inactive vertex becomes infected if it has enough active neighbors.</p>
  },
  {
    selector: "[data-tour=\"upload-adjacency-matrix-button\"]",
    content: "If you want to visualize bootstrap percolation on a different graph, upload its adjacency matrix here. Click the help icon for details on the file format."
  },
  {
    selector: "[data-tour=\"contagious-set-button\"]",
    content: "This button finds the minimum contagious set of the current graph and renders it in the graph display pane. It uses an exponential-time algorithm, so it might load for a while if the graph is large."
  },
  {
    selector: "[data-tour=\"contagious-set-button\"]",
    content: "If the switch is engaged, this button uses a greedy algorithm instead. It still finds a small contagious set, but it might not be minimum, and it will be displayed much faster."
  },
  {
    selector: "[data-tour=\"random-seed-set-button\"]",
    content: "This button can also generate and display a seed set. It includes each vertex independently at random with the given probability."
  },
  {
    content: "That's just about everything you need to know. Have fun percolating!"
  }
];

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
      tourOpen: true,
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
   * If the input file is invalid according to these rules, an error message will pop up on the screen, and the desired graph will not be rendered.
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
      const rows = string.split("\n");
      const seeds = rows[0].trim().split(","); // an array defining which vertices are seeds in the desired graph
      const adjacencyMatrix = []; // the adjacency matrix of the desired graph
      for(let i = 1; i < rows.length; i++) {
        adjacencyMatrix[i - 1] = rows[i].trim().split(",");
      }
    
      // Check that the input is valid.
      if(ForceGraph.hasValidShape(seeds, adjacencyMatrix) && ForceGraph.hasValidEntries(seeds, adjacencyMatrix) && ForceGraph.representsValidGraph(adjacencyMatrix)) {
        // Create a graph according to the adjacency matrix.
        const graph = new Graph();
        for(let i = 0; i < seeds.length; i++) {
          graph.addVertex(i);
          if(seeds[i] === "+") {
            graph.activateVertex(i);
          }
          for(let j = 0; j < i; j++) {
            if(adjacencyMatrix[i][j] === "1") {
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
   * Checks that the given arrays have valid shape, as defined for @see readAdjacencyMatrix.
   * adjacencyMatrix should be square with the same width as seeds.
   * If the arrays do not have valid shape, an error message will pop up on the screen.
   * @param {Array} seeds an array
   * @param {Array} adjacencyMatrix a 2-D array
   * @returns true if the arrays have valid shape, false otherwise
   */
  static hasValidShape(seeds, adjacencyMatrix) {
    for(const r of adjacencyMatrix) {
      if(r.length !== seeds.length) {
        window.alert("Invalid input. Each row must have the same length.");
        return false;
      }
    }
    if(adjacencyMatrix.length !== seeds.length) {
      window.alert("Invalid input. The adjacency matrix must be a square matrix.");
      return false;
    }
    return true;
  }

  /**
   * Checks that the given arrays have valid entries, as defined for @see readAdjacencyMatrix.
   * Each entry in seeds should be a '+' or '-' character.
   * Each entry in adjacencyMatrix should be a '1' or '0' character.
   * If the arrays do not have valid entries, an error message will pop up on the screen.
   * @param {Array} seeds an array
   * @param {Array} matrix a 2-D array
   * @returns true if the matrix has valid entries, false otherwise
   */
  static hasValidEntries(seeds, matrix) {
    for(const entry of seeds) {
      if(entry !== "+" && entry !== "-") {
        window.alert("Invalid input. There must be a row of +'s and -'s above the adjacency matrix, indicating which vertices are seeds.");
        return false;
      }
    }
    for(const row of matrix) {
      for(const entry of row) {
        if(entry !== "0" && entry !== "1") {
          window.alert("Invalid input. Every entry in the adjacency matrix must be 1 or 0, indicating the presence or absence of an edge, respectively.");
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Checks that the adjacency matrix represents a valid (simple and undirected) graph.
   * The matrix should be symmetric. Each entry on the diagonal should be a '0' character.
   * @param {Array} matrix a 2-D array with a valid shape and valid entries, as defined by @see hasValidShape and @see hasValidEntries
   * @returns true if the matrix represents a valid graph, false otherwise.
   */
  static representsValidGraph(matrix) {
    for(let i = 0; i < matrix.length; i++) {
      for(let j = 0; j < i; j++) {
        if(matrix[i][j] !== matrix[j][i]) {
          window.alert("Invalid input. The adjacency matrix must be symmetric, defining an undirected graph.");
          return false;
        }
      }
      if(matrix[i][i] !== "0") {
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
   * Closes the tour that shows users how to use Booper, allowing them to start actually using it.
   */
  closeTour = () => {
    this.setState({tourOpen: false});
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
    const HEIGHT_OFFSET = 100;
    const INACTIVE_COLOR = "#5375e2";
    const ACTIVE_COLOR = "#f65868";
    const RECENTLY_INFECTED_COLOR = "#228b22";
    const BACKGROUND_COLOR = "#fefefe";

    setTimeout(() => {
      this.graphRef.current.d3Force("collide", forceCollide());
      this.graphRef.current.d3Force("center", null);
      this.graphRef.current.d3Force("x", forceX().strength(0.01));
      this.graphRef.current.d3Force("y", forceY().strength(0.01));
      this.graphRef.current.d3Force("z", forceZ().strength(0.01));
      this.graphRef.current.d3Force("charge").strength(-100);
    }, 100);

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
          inactiveVerticesCount={this.state.forceData.nodes.length - this.state.activeVerticesCount}
        />
        <div data-tour="graph-display-pane">
          <ForceGraph2D graphData={this.state.forceData}
            nodeColor={d => d.recentlyInfected ? RECENTLY_INFECTED_COLOR : d.active ? ACTIVE_COLOR : INACTIVE_COLOR}
            linkColor="#5c616e"
            linkOpacity={0.7}
            linkWidth={3.5}
            backgroundColor={BACKGROUND_COLOR}
            width={this.state.windowSize.width - TOOLBAR_WIDTH}
            height={this.state.windowSize.height - HEIGHT_OFFSET}
            ref={this.graphRef}
          />
        </div>
      </Box>
      <Tour steps={TOUR_STEPS} isOpen={this.state.tourOpen} onRequestClose={this.closeTour} />
    </div>;
  }
}

export default ForceGraph;

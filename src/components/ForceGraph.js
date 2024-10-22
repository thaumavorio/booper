/*
 * This file is part of Booper, a bootstrap percolation visualization tool.
 * Copyright (C) 2020-2021 Connor Anderson <canderson@thaumavor.io>, Akshaj
 * Balasubramanian <bakshaj99@gmail.com>, Henry Poskanzer <hposkanzer@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import * as React from "react";
import ForceGraph2D from "react-force-graph-2d";
import { forceCollide, forceX, forceY, forceZ } from "d3-force-3d";
import Graph from "../classes/Graph";
import update from "immutability-helper";
import { trackPromise } from "react-promise-tracker";
import GraphTaskbar from "./GraphTaskbar";
import { withTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import PropTypes from "prop-types";
import { LoadingSpinnerComponent } from "./LoadingSpinnerComponent";
import Tour from "reactour";
import { readString } from "react-papaparse";
import Cookies from "js-cookie";

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
    content: "This is the graph display pane. It shows the graph that is being percolated on. Nodes are drawn in two different colors, depending on whether they're active or inactive. You can use the mouse to zoom in or out, pan around, or drag the graph around."
  },
  {
    selector: "[data-tour=\"next-iteration-button\"]",
    content: "Here's where you can visualize the percolation. This button performs one iteration of two-neighbor bootstrap percolation. Each inactive node that has at least two active neighbors is infected. Try clicking it now; the next step in the tutorial will show you what happens in the graph display pane."
  },
  {
    selector: "[data-tour=\"graph-display-pane\"]",
    content: "Nodes that were infected in the most recent iteration are given a third color."
  },
  {
    selector: "[data-tour=\"parameter-text-fields\"]",
    content: <p>You can modify the parameters of bootstrap percolation. The <b>threshold</b> is the number of active neighbors required to infect an inactive node. The <b>probability</b> is the probability that an inactive node becomes infected if it has enough active neighbors.</p>
  },
  {
    selector: "[data-tour=\"last-iteration-button\"]",
    content: "This button performs percolation iterations until no more nodes can be infected. Then it shows you the final result."
  },
  {
    selector: "[data-tour=\"upload-adjacency-matrix-button\"]",
    content: "If you want to visualize bootstrap percolation on a different graph, upload its adjacency matrix here. See the tooltip for details on the file format."
  },
  {
    selector: "[data-tour=\"random-graph-button\"]",
    content: "Or you can use this button to generate a random graph with given parameters."
  },
  {
    selector: "[data-tour=\"min-contagious-set-button\"]",
    content: "This button finds a minimum contagious set of the current graph and renders it in the graph display pane. It uses an exponential-time algorithm, so it might load for a while if the graph is large. We don't recommend using this feature for graphs with more than 50 nodes."
  },
  {
    selector: "[data-tour=\"greedy-contagious-set-button\"]",
    content: "This button has similar functionality, but it uses a greedy algorithm instead. It finds a (usually small, but often not minimum) contagious set, which will be displayed much faster. We don't recommend using this feature for graphs with more than 500 nodes."
  },
  {
    selector: "[data-tour=\"random-seed-set-button\"]",
    content: "This button can also generate and display a seed set. It chooses a random seed set from all seed sets of the given size."
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
      tourOpen: Cookies.get("tourDone") === undefined,
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
      const parseResults = readString(string, {delimitersToGuess: [",", "\t"]});
      // Check for parsing errors.
      if(parseResults.errors.length > 0) {
        let errorMessage = "Parsing error.\n";
        for(let i = 0; i < parseResults.errors.length; i++) {
          errorMessage += `Line ${parseResults.errors[i].row}: ${parseResults.errors[i].message}.\n`;
        }
        window.alert(errorMessage);
        return;
      }
      const seeds = parseResults.data[0]; // an array defining which vertices are seeds in the desired graph
      const adjacencyMatrix = parseResults.data.slice(1); // the adjacency matrix of the desired graph

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
        window.alert("Invalid input. There must be a row of +'s and -'s above the adjacency matrix, indicating which nodes are seeds.");
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
   * Generates and displays an Erdos-Renyi graph given parameters specified by the user in text fields.
   * Adds the given number of vertices.
   * Chooses the edges uniformly at random for all edge sets of the given size.
   */
  randomGraph = () => {
    const numNodes = parseInt(document.getElementById("num-nodes").value); // number of nodes in the graph
    let numEdges = parseInt(document.getElementById("num-edges").value); // number of edges in the graph
    if(!isNaN(numNodes) && !isNaN(numEdges)) {
      const graph = new Graph();
      const potentialEdges = [];
      for(let i = 0; i < numNodes; i++) {
        graph.addVertex(i);
        for(let j = 0; j < i; j++) {
          potentialEdges.push([i, j]);
        }
      }
      if(numEdges > potentialEdges.length) {
        numEdges = potentialEdges.length;
      }
      for(let i = 0; i < numEdges; i++) {
        const edgeIndex = Math.floor(Math.random() * (potentialEdges.length - i));
        graph.addEdge(potentialEdges[edgeIndex][0], potentialEdges[edgeIndex][1]);
        potentialEdges[edgeIndex] = potentialEdges[potentialEdges.length - i - 1];
      }
      this.setState({
        graph,
        forceData: graph.getGraphData(),
        bootstrapPercolationIteration: 0,
        activeVerticesCount: 0,
      });
    }
  }

  /**
   * Finds a minimum contagious set of the currently displayed graph.
   * Sends the graph and treshold in an HTTP request to a server, which performs the algorithm and sends the result in a response object.
   * When the response object is received, the minimum contagious set is rendered.
   */
  getMinContagiousSet = () => {
    trackPromise(
      this.state.graph.findMinimalContagiousSet(this.state.bootstrapPercolationThreshold)
        .then(res => {
          if (res.status === 504) {
            throw new Error("Timeout while finding minimum contagious set");
          }
          return res;
        })
        .then(res => res.json())
        .then(infectedVerts => this.setState(function(state){
          const g = update(state.graph, {$set: state.graph.deactivateAllVertices()});
          g.activateVertices(infectedVerts);
          return {
            graph: g,
            forceData: g.getGraphData(state.forceData),
            bootstrapPercolationIteration: 0,
            activeVerticesCount: g.getActiveVerticesCount() };
        }))
        .catch(error => window.alert("Error: " + error.message + "."
          + " Errors often occur when the graph is too large for the optimal"
          + " solution to be found before the timeout. The current timeout is"
          + " 1 minute, which allows for dense graphs of up to about 30"
          + " vertices and sparse graphs of up to about 50."))); // TODO: Make nicer popup
  };

  /**
   * Finds a small contagious set of the currently displayed graph.
   * Sends the graph and treshold in an HTTP request to a server, which performs a greedy algorithm and sends the result in a response object.
   * When the response object is received, the minimum contagious set is rendered.
   */
  getGreedyContagiousSet = () => {
    trackPromise(
      this.state.graph.findContagiousSetGreedily(this.state.bootstrapPercolationThreshold)
        .then(res => res.json())
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
   * Chooses one seed set uniformly at random among all possible seed sets of the given size.
   * Renders the resulting seed set.
   */
  randomSeedSet = () => {
    const numSeeds = parseInt(document.getElementById("num-seeds").value);
    if(!isNaN(numSeeds)) {
      this.setState(function(state) {
        const g = update(state.graph, {$set: state.graph.randomSeedSet(numSeeds)});
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
    const newThreshold = parseInt(evt.target.value);
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
    Cookies.set("tourDone", "true", { expires: 365 });
    this.setState({tourOpen: false});
  }

  /**
   * Shows the tour that shows users how to use Booper, allowing them to start actually using it.
   */
  showTour = () => {
    this.setState({tourOpen: true});
  }

  /**
   * When a component is inside another component and the user clicks on the child component, prevents the parent component from reacting the click.
   * @param {Object} event an event object representing a mouse click
   */
  stopPropagation = (event) => {
    event.stopPropagation();
  }

  render() {

    TOUR_STEPS[1].position = [this.state.windowSize.width / 2, this.state.windowSize.height - 250];
    TOUR_STEPS[3].position = TOUR_STEPS[1].position;

    setTimeout(() => {
      this.graphRef.current.d3Force("collide", forceCollide());
      this.graphRef.current.d3Force("center", null);
      this.graphRef.current.d3Force("x", forceX().strength(0.01));
      this.graphRef.current.d3Force("y", forceY().strength(0.01));
      this.graphRef.current.d3Force("z", forceZ().strength(0.01));
      this.graphRef.current.d3Force("charge").strength(-100);
    }, 100);

    return <div style={{position: "relative", height: this.state.windowSize.height, backgroundColor: this.props.theme.palette.background.main}}>
      <LoadingSpinnerComponent />
      <div style={{zIndex: 1, float: "left", position: "absolute", alignItems: "center", maxWidth: "30%"}}>
        <GraphTaskbar readAdjacencyMatrix={this.readAdjacencyMatrix}
          randomGraph={this.randomGraph}
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
          height = {this.state.windowSize.height - 150}
        />
      </div>
      <div data-tour="graph-display-pane">
        <ForceGraph2D graphData={this.state.forceData}
          nodeColor={d => d.recentlyInfected ? this.props.theme.palette.recentlyActive.main : d.active ? this.props.theme.palette.active.main : this.props.theme.palette.inactive.main}
          linkColor={() => this.props.theme.palette.link.main}
          backgroundColor={this.props.theme.palette.background.main}
          linkOpacity={0.7}
          linkWidth={3.5}
          width={this.state.windowSize.width}
          height={this.state.windowSize.height - 100}
          ref={this.graphRef}
        />
      </div>
      <Tour steps={TOUR_STEPS} isOpen={this.state.tourOpen} onRequestClose={this.closeTour} startAt={0} lastStepNextButton={"End Tutorial"} />
      <div style={{zIndex: 1, position: "absolute", top: 0, right: 0}}>
        <IconButton onClick={this.showTour} color="secondary">
          <HelpOutlineIcon />
        </IconButton>
      </div>
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

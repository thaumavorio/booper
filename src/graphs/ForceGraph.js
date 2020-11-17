import * as React from "react";
import ForceGraph2D from 'react-force-graph-2d';
import Graph from "./Graph";


let graphs = setUpGraphs();
let graph1 = graphs[0];
let graph2 = graphs[1];
let graph3 = graphs[2];

class ForceGraph extends React.Component{
  state = {
      graph: graph2
  };

  getMinContagiousSet = () => {
    this.state.graph.findMinimalContagiousSet(2)
                      .then(infectedVerts => this.setState((state) => ({
                      graph: state.graph.activateVertices(infectedVerts)}),
                          () => { console.log(this.state.graph.getGraphData()) }
    ))
  };

    getGreedyContagiousSet = () => {
        this.state.graph.findContagiousSetGreedily(2)
            .then(infectedVerts => this.setState((state) => ({
                graph: state.graph.activateVertices(infectedVerts)})
            ))
    };

  resetInfections = () => {
    this.state.graph.deactivateAllVertices();
    this.setState( (state) => ({
      graph: state.graph
    }));
  };

  percolationIteration = () => {
    this.setState( function(state) {
        return { graph: state.graph.bootstrapPercolationIteration(2) };
      });
  }


    render() {
      console.log(this.state.graph.getGraphData());
        return <div>
          <button onClick={this.resetInfections}>Reset</button>
          <button onClick={this.getMinContagiousSet}>Get Minimum Contagious Set</button>
          <button onClick={this.getGreedyContagiousSet}>Get Contagious Set Greedily</button>
          <button onClick={this.percolationIteration}>Bootstrap Percolate!</button>
          <ForceGraph2D graphData={this.state.graph.getGraphData()}
                nodeColor={d => d.infected ? "red" : "green"}
                nodeLabel={d => d.id}
                linkOpacity={0.5}	
                linkWidth={3}
                />
                </div>;
    }


  }

function setUpGraphs(){
    var graph1 = new Graph();
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

    var graph2 = new Graph();
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

    var graph3 = new Graph();
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

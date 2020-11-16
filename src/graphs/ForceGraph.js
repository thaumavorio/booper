import * as React from "react";
import ForceGraph2D from 'react-force-graph-2d';


var data = [];
class ForceGraph extends React.Component{
  constructor(props) {
    super(props);
    this.state = {infectedVertices: []};
  }

  getMinContagiousSet = () => {
    this.props.data.findMinimalContagiousSet(2)
                  .then(infectedVerts => this.setState({
                  infectedVertices: infectedVerts},
                  () => {
                    console.log(this.state);
                  }
    ))
  };

  getGreedyContagiousSet = () => {
    this.props.data.findContagiousSetGreedily(2)
                  .then(infectedVerts => this.setState({
                  infectedVertices: infectedVerts},
                  () => {
                    console.log(this.state);
                  }
    ))
  };

  resetInfections = () => {
    data = setUpData(this.props.data);
    for(var v in data.nodes){
      data.nodes[v].infected = false;
    }
    this.props.data.deactivateAllVertices();
    this.setState({
      infectedVertices: []},
      () => {
        console.log(this.state);
      })
  };

  percolationIteration = () => {
    this.props.data.activateVertex(1);
    this.props.data.activateVertex(2);
    this.props.data.bootstrapPercolationIteration(2);
    this.setState({
      infectedVertices: Array.from(this.props.data.activeVertices)},
      () => {
        console.log(this.state);
      }
)
  }


    render() {
      data = setUpData(this.props.data);
      for(var v in data.nodes){
        data.nodes[v].infected = false;
      }
      var infected = Array.from(this.state.infectedVertices);
      for(var v of infected){
        data.nodes[v].infected = true;
      }
      console.log(infected);
        return <div>
          <button onClick={this.resetInfections}>Reset</button>
          <button onClick={this.getMinContagiousSet}>Get Minimum Contagious Set</button>
          <button onClick={this.getGreedyContagiousSet}>Get Contagious Set Greedily</button>
          <button onClick={this.percolationIteration}>Bootstrap Percolate!</button>
          <ForceGraph2D graphData={data}
                nodeColor={d => d.infected ? "red" : "green"}
                linkOpacity={0.5}	
                linkWidth={3}
                />
                </div>;
    }


  }

  function setUpData(data){
  // constructing nodes data for simulation
    var nodes = []
    for(var i of data.getVertices()){
        var node = {}
        node.id = i;
        node.infected = false;
        nodes[nodes.length] = node;
    }

    // constructing links data for simulation
    var links = []
    for(var i of data.getVertices()){
        for(var j of data.getNeighbors(i)){
            var link = {};
            link.source = i;
            link.target = j;
            links[links.length] = link;
        }
    }
    return { nodes, links };
}



export default ForceGraph;

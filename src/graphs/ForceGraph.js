import * as React from "react";
import ForceGraph2D from 'react-force-graph-2d';
import Graph from "./Graph";
import update from 'immutability-helper';
import { Box, Button, ButtonGroup, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


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
            graph: graph1
        };
    }


  getMinContagiousSet = () => {
    this.state.graph.findMinimalContagiousSet(2)
          .then(infectedVerts => this.setState(function(state){
            const g = update(state.graph, {$set: state.graph.deactivateAllVertices()});
            g.activateVertices(infectedVerts);
            return { graph: g};
          }));
    };

  getGreedyContagiousSet = () => {
        this.state.graph.findContagiousSetGreedily(2)
            .then(infectedVerts => this.setState(function(state){
                const g = update(state.graph, {$set: state.graph.deactivateAllVertices()});
                g.activateVertices(infectedVerts);
                return { graph: g};
            }));
    };

  resetInfections = () => {
    this.state.graph.deactivateAllVertices();
    this.setState( (state) => ({
      graph: state.graph
    }));
  };

  percolationIteration = () => {
      const g = update(this.state.graph, {$set: this.state.graph.bootstrapPercolationIteration(2)})
      this.setState( {
              graph: g
      });
  }

  render() {
      return <div>
          <Box display="flex" flexDirection="row">
              <Box component="span" display="flex" flexWrap="wrap" alignContent="center" m={1} p={1}>
                  <ButtonGroup
                      orientation="vertical"
                      color = "Primary"
                      aria-label = "vertical outlined primary button group"
                      variant = "outlined"
                  >
                      <h3 color = "Secondary">GRAPH SETTINGS</h3>
                      <Button color = "Primary" onClick={this.resetInfections}>Reset</Button>
                      <br/>
                      <br/>
                      <Divider variant = "middle" color = "Secondary"/>
                      <br/>
                      <br/>
                      <h3>CONTAGIOUS SETS</h3>
                      <ButtonGroup
                          orientation="horizontal"
                          color = "Primary"
                          aria-label = "horizontal outlined primary button group"
                          variant = "outlined"
                      >
                          <Button style={{ fontSize: '12px' }} color = "Primary" onClick={this.getMinContagiousSet}>Minimum Contagious Set</Button>
                          <Button style={{ fontSize: '12px' }} color = "Primary" onClick={this.getGreedyContagiousSet}>Greedy Contagious Set</Button>
                      </ButtonGroup>
                      <br/>
                      <br/>
                      <Divider variant = "middle" color = "Secondary"/>
                      <br/>
                      <br/>
                      <h3>BOOTSTRAP PERCOLATION</h3>
                      <Button color = "Primary" onClick={this.percolationIteration}>Percolation Step</Button>
                  </ButtonGroup>
              </Box>
              <ForceGraph2D graphData={this.state.graph.getGraphData()}
                    nodeColor={d => d.infected ? "#f65868" : "#5375e2"}
                    linkOpacity={0.5}
                    linkWidth={3}
                    backgroundColor="#fefefe"
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

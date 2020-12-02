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
            graph: graph1,
            forceData: graph1.getGraphData(),
            windowSize: {
                height: window.innerHeight,
                width: window.innerWidth
            }
        };
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    updateDimensions() {
        this.setState({graph: this.state.graph, forceData: this.state.forceData, windowSize: {height: window.innerHeight, width: window.innerWidth}});
    }

  getMinContagiousSet = () => {
    this.state.graph.findMinimalContagiousSet(2)
          .then(infectedVerts => this.setState(function(state){
            const g = update(state.graph, {$set: state.graph.deactivateAllVertices()});
            g.activateVertices(infectedVerts);
            return { graph: g, forceData: g.getGraphData(state.forceData), windowSize: { height: window.innerHeight, width: window.innerWidth } };
          }));
    };

  getGreedyContagiousSet = () => {
        this.state.graph.findContagiousSetGreedily(2)
            .then(infectedVerts => this.setState(function(state){
                const g = update(state.graph, {$set: state.graph.deactivateAllVertices()});
                g.activateVertices(infectedVerts);
                return { graph: g, forceData: g.getGraphData(state.forceData), windowSize: { height: window.innerHeight, width: window.innerWidth } };
            }));
    };

  resetInfections = () => {
    this.state.graph.deactivateAllVertices();
    this.setState(state =>
            ({ graph: state.graph, forceData: state.graph.getGraphData(state.forceData), windowSize: { height: window.innerHeight, width: window.innerWidth } })
    );
  };

  percolationIteration = () => {
      const g = update(this.state.graph, {$set: this.state.graph.bootstrapPercolationIteration(2)})
      this.setState(state =>
            ({ graph: g, forceData: g.getGraphData(state.forceData), windowSize: { height: window.innerHeight, width: window.innerWidth } })
      );
  }

  render() {
      const TOOLBAR_WIDTH = 300;
      return <div>
          <Box display="flex" flexDirection="row">
              <Box component="span" display="flex" flexDirection="column" flexWrap="wrap" alignContent="center" color="Secondary" m={1} p={1} width={TOOLBAR_WIDTH}>
                  <br/>
                  <br/>
                  <h3>GRAPH SETTINGS</h3>
                  <Button color = "Primary" variant="outlined" onClick={this.resetInfections}>Reset</Button>
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
                  <Button color = "Primary" variant="outlined" onClick={this.percolationIteration}>Percolation Step</Button>
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

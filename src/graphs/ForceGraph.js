import * as React from "react";
import ForceGraph2D from 'react-force-graph-2d';

class ForceGraph extends React.Component{
    
    render() {
        var data = setUpData(this.props.data);
        // data.nodes = [
        //             {"id": "0", "infected": true},
        //             {"id": "1", "infected": false},
        //             {"id": "2", "infected": true},
        //             {"id": "3", "infected": false},
        //             {"id": "4", "infected": false},
        //             {"id": "5", "infected": true},
        //             {"id": "6", "infected": false}
        //         ]
        // data.links = [
        //             {"source": "0", "target": "1"},
        //             {"source": "0", "target": "2"},
        //             {"source": "1", "target": "4"},
        //             {"source": "2", "target": "3"},
        //             {"source": "2", "target": "4"},
        //             {"source": "2", "target": "5"},
        //             {"source": "3", "target": "6"},
        //             {"source": "4", "target": "5"}
        //         ]
        return <ForceGraph2D graphData={data}
                nodeColor={d => d.infected ? "red" : "green"}
                linkOpacity={0.5}	
                linkWidth={3}
                />;
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
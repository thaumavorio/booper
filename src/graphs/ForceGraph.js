import * as React from "react";
import ForceGraph2D from 'react-force-graph-2d';

class ForceGraph extends React.Component {
    render() {
        var data = {};
        data.nodes = [
                    {"id": "0", "infected": false},
                    {"id": "1", "infected": false},
                    {"id": "2", "infected": false},
                    {"id": "3", "infected": false},
                    {"id": "4", "infected": false},
                    {"id": "5", "infected": false},
                    {"id": "6", "infected": false}
                ]
        data.links = [
                    {"source": "0", "target": "1"},
                    {"source": "0", "target": "2"},
                    {"source": "1", "target": "4"},
                    {"source": "2", "target": "3"},
                    {"source": "2", "target": "4"},
                    {"source": "2", "target": "5"},
                    {"source": "3", "target": "6"},
                    {"source": "4", "target": "5"}
                ]
        return <ForceGraph2D graphData={data}/>;
    }
  }

export default ForceGraph;
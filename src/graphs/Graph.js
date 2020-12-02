export default class Graph {
    constructor() {
      this.adj = new Map();
      this.activeVertices = new Set();
    }

    addVertex(v) {
      this.adj.set(v, new Set());
    }

    addEdge(u, v) {
      this.adj.get(u).add(v);
      this.adj.get(v).add(u);
    }

    getVertices() {
      return this.adj.keys();
    }

    getNeighbors(v) {
      return this.adj.get(v);
    }

    getDegree(v) {
      return this.getNeighbors(v).size;
    }

    activateVertex(v) {
        console.log("Activate Vertex call: " + v.toString());
        return this.activeVertices.add(v.toString());
    }

    activateVertices(vs) {
        let v;
        for (v of vs) {
            this.activateVertex(v);
        }
        return this;
    }

    deactivateAllVertices() {
      this.activeVertices.clear();
      return this;
    }

    bootstrapPercolationIteration(threshold) {
      const vertices = this.getVertices();
      const infectedVertices = new Set();

      for (let v of vertices) {
        console.log("Looking at", v);
        if (this.activeVertices.has(v.toString())) {
          console.log("\tIt's already active.");
          continue;
        }

        const neighbors = this.getNeighbors(v);

        let count = 0;

        for (let n of neighbors) {
          if (this.activeVertices.has(n.toString())) {
            count++;
          }
        }

        console.log("\tIt has", count, "active neighbors.");

        if (threshold <= count) {
          console.log("\tIt is thus infected.");
          infectedVertices.add(v);
        }
      }

      for(const vertex of infectedVertices) {
        console.log("Adding infected vertex: " + vertex);
        this.activateVertex(vertex);
      }
      return this;
    }

    getEdgeString() { // TODO: make not ugly on both Haskell and JS side. Also, factor out to getEdges()
      var edge = "[";
      for (let v of this.getVertices()) {
        for (let n of this.getNeighbors(v)) {
          if (v < n) { // TODO: assumes simple. is this ok?
            edge += `(${v},${n}),`
          }
        }
      }
      return edge.slice(0, -1) + "]";
    }

    // NB: returns promise
    findContagiousSetGreedily(threshold) {
      return fetch(`https://thaumic.dev/booper/greedy?graph=${this.getEdgeString()}&threshold=${threshold}`)
               .then(res => res.json());
    }

    // NB: returns promise
    findMinimalContagiousSet(threshold) {
      return fetch(`https://thaumic.dev/booper/min?graph=${this.getEdgeString()}&threshold=${threshold}`)
               .then(res => res.json());
    }

    // retrieves formatted graph data for ForceGraph
    getGraphData(oldData = {nodes: [], links: []}) {
        let nodes = [];
        let edges = [];
        for (let v of this.getVertices()) {
            let node = {"id": v, "infected": this.activeVertices.has(v.toString())};
            let oldNode = oldData.nodes.find(nod => nod.id === v);

            if (oldNode !== undefined) {
                nodes.push({...oldNode, ...node});
                nodes[nodes.length - 1].index = nodes.length - 1; // TODO: necessary?
            } else {
                nodes.push(node);
            }
        }

        for (let v of this.getVertices()) { // TODO: convert to iterator over edges some day
            for (let n of this.getNeighbors(v)) {
                let edge = {"source": nodes[v], "target": nodes[n]};
                let oldEdge = oldData.links.find(link => link.source.id === v && link.target.id === n);

                if (v < n && oldEdge !== undefined) {
                    edges.push({...oldEdge, ...edge});
                    edges[edges.length - 1].index = edges.length - 1; // TODO: necessary?
                } else if (v < n) {
                    edges.push(edge);
                }
            }
        }

        return {"nodes": nodes, "links": edges};
    }
  }

export default class Graph {
    constructor() {
      this.adj = new Map();
      this.activeVertices = new Set();    // all active vertices
      this.recentlyInfected = new Set();  // vertices that were infected in the most recent percolation iteration
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

    getActiveVerticesCount() {
        return this.activeVertices.size;
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
      this.recentlyInfected.clear();
      return this;
    }

    randomSeedSet(inclusionProbability) {
      this.deactivateAllVertices();
      for(var v of this.getVertices()) {
        if(Math.random() < inclusionProbability){
          this.activateVertex(v);
        }
      }
      return this;
    }

    bootstrapPercolationIteration(threshold) {
      const vertices = this.getVertices();
      this.recentlyInfected.clear();

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
          this.recentlyInfected.add(v);
        }
      }

      for(const vertex of this.recentlyInfected) {
        console.log("Adding infected vertex: " + vertex);
        this.activateVertex(vertex);
      }
      return this;
    }

    getEdges() {
      var edges = []
      for (let v of this.getVertices()) {
        for (let n of this.getNeighbors(v)) {
          if (v < n) { // TODO: assumes simple. is this ok?
            edges.push([v,n])
          }
        }
      }
      return edges
    }

    getWebGraphJSON() {
      return JSON.stringify({ webGraphVertices: Array.from(this.getVertices()), webGraphEdges: this.getEdges() })
    }

    // NB: returns promise
    findContagiousSetGreedily(threshold) {
      return fetch(`https://thaumic.dev/booper/greedy?graph=${this.getWebGraphJSON()}&threshold=${threshold}`)
               .then(res => res.json());
    }

    // NB: returns promise
    findMinimalContagiousSet(threshold) {
      return fetch(`https://thaumic.dev/booper/min?graph=${this.getWebGraphJSON()}&threshold=${threshold}`)
               .then(res => res.json());
    }

    // retrieves formatted graph data for ForceGraph
    getGraphData(oldData = {nodes: [], links: []}) {
        let nodes = [];
        let edges = [];
        for (let v of this.getVertices()) {
            let node = {"id": v, "active": this.activeVertices.has(v.toString()), "recentlyInfected": this.recentlyInfected.has(v)};
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

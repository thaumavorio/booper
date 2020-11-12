export default class Graph {
    constructor() {
      this.adj = new Map();
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
  }
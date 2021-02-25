/** @module Graph */

/**
 * A simple graph capable of being used in activation processes.
 */
export default class Graph {
  /**
   * Instantiates an empty graph.
   */
  constructor() {
    /** @private */ this.adj = new Map();
    /** @private */ this.activeVertices = new Set();    // all active vertices
    /** @private */ this.recentlyInfected = new Set();  // vertices that were infected in the most recent percolation iteration
  }

  /**
   * Adds a vertex to the graph.
   *
   * By default, the new vertex has no adjacent vertices.
   * @param {number} v The vertex to add.
   */
  addVertex(v) {
    this.adj.set(v, new Set());
  }

  /**
   * Adds an edge to the graph.
   *
   * Graphs are assumed to be simple. We do not check if the new edge already
   * exists in the graph.
   *
   * @param {number} u The first of the two vertices in the edge.
   * @param {number} v The second of the two vertices in the edge.
   */
  addEdge(u, v) {
    this.adj.get(u).add(v);
    this.adj.get(v).add(u);
  }

  /**
   * Returns the vertex set.
   * @returns {iterable} An iterable over the vertices of the graph.
   */
  getVertices() {
    return this.adj.keys();
  }

  /**
   * Returns the set of neighbors of the given vertex.
   * @param {number} v The vertex whose neighborhood we will return.
   * @returns {iterable} An iterable over the neighbors of the given vertex.
   */
  getNeighbors(v) {
    return this.adj.get(v);
  }

  /**
   * Returns the degree of the given vertex.
   * @param {number} v The vertex whose degree we will return.
   * @returns {number} The degree of the given vertex.
   */
  getDegree(v) {
    return this.getNeighbors(v).size;
  }

  /**
   * Returns the number of active vertices in the graph.
   * @returns {number} The number of active vertices in the graph.
   */
  getActiveVerticesCount() {
    return this.activeVertices.size;
  }

  /**
   * Activates the given vertex in the graph.
   *
   * If the vertex is already active, this is equivalent to doing nothing.
   * @param {number} v The vertex to activate.
   * @return {Set<number>} The set of active vertices after the addition of the vertex.
   */
  activateVertex(v) {
    console.log("Activate Vertex call: " + v.toString());
    return this.activeVertices.add(v.toString());
  }

  /**
   * Activates the given vertices in the graph.
   * @param {iterable} vs The vertex to activate.
   * @return {Graph} The graph.
   */
  activateVertices(vs) {
    for (const v of vs) {
      this.activateVertex(v);
    }
    return this;
  }

  /**
   * Deactivates all vertices in the graph.
   * @return {Graph} The graph.
   */
  deactivateAllVertices() {
    this.activeVertices.clear();
    this.recentlyInfected.clear();
    return this;
  }

  /**
   * Iterates through every vertex in the graph, activating each with the given
   * probability.
   * @param {number} inclusionProbability The probability that a vertex will be activated.
   * @return {Graph} The graph.
   */
  randomSeedSet(inclusionProbability) {
    this.deactivateAllVertices();
    for(const v of this.getVertices()) {
      if(Math.random() < inclusionProbability){
        this.activateVertex(v);
      }
    }
    return this;
  }

  /**
   * Peform one bootstap percolation iteration.
   * For each vertex, if it has enough active neighbors, it is activated with the given probability.
   * @param {number} threshold The number of active vertices an inactive vertex
   * must have to be activated this iteration.
   * @param {number} infectionProbability If the threshold is reached, the
   * inactive vertex is activated with this probability.
   * @return {boolean} If any inactive vertices had enough active neighbors to
   * be activated, false. Otherwise, true.
   */
  bootstrapPercolationIteration(threshold, infectionProbability) {
    const vertices = this.getVertices();
    this.recentlyInfected.clear();
    let done = true;

    for (const v of vertices) {
      console.log("Looking at", v);

      if (this.activeVertices.has(v.toString())) {
        console.log("\tIt's already active.");
        continue;
      }

      const neighbors = this.getNeighbors(v);
      let count = 0;
      for (const n of neighbors) {
        if (this.activeVertices.has(n.toString())) {
          count++;
        }
      }
      console.log("\tIt has", count, "active neighbors.");

      if (threshold <= count) {
        done = false;
        if(Math.random() < infectionProbability) {
          console.log("\tIt is thus infected.");
          this.recentlyInfected.add(v);
        }
      }
    }

    for(const vertex of this.recentlyInfected) {
      console.log("Adding infected vertex: " + vertex);
      this.activateVertex(vertex);
    }
    return done;
  }

  /**
   * An iterator over the edges in the graph.
   * @return {Generator} An iterable over the edges in the graph.
   */
  *getEdges() {
    for (const v of this.getVertices()) {
      for (const n of this.getNeighbors(v)) {
        if (v < n) { // TODO: assumes simple. is this ok?
          yield [v,n];
        }
      }
    }
  }

  /**
   * Returns a JSON string representing the graph for communication with the
   * back-end.
   * @return {string} A JSON string representing the graph.
   */
  getWebGraphJSON() {
    return JSON.stringify({ webGraphVertices: Array.from(this.getVertices()), webGraphEdges: Array.from(this.getEdges()) });
  }

  /**
   * Approximates a minimum contagious set by contacting the back-end server
   * which greedily finds such a set.
   * @param {threshold} threshold The threshold we use for bootstrap
   * percolation.
   * @return {Promise} A Promise whose result will be a vertex list which
   * approximates a minimal contagious set of the graph.
   */
  findContagiousSetGreedily(threshold) {
    return fetch(`https://thaumic.dev/booper/greedy?graph=${this.getWebGraphJSON()}&threshold=${threshold}`)
      .then(res => res.json());
  }

  /**
   * Returns a minimum contagious set by contacting the back-end server
   * which greedily finds such a set.
   * @param {threshold} threshold The threshold we use for bootstrap
   * percolation.
   * @return {Promise} A Promise whose result will be a vertex list which
   * represents a minimal contagious set of the graph.
   */
  findMinimalContagiousSet(threshold) {
    return fetch(`https://thaumic.dev/booper/min?graph=${this.getWebGraphJSON()}&threshold=${threshold}`)
      .then(res => res.json());
  }

  /**
   * Given the old force graph data, returns an updated graph data list with
   * current vertex and edge information.
   * @param {Object} oldData An object containing the vertices (as nodes) and
   * edges (as links) lists from the old force graph data.
   * @return {Object} An object containing the update vertices (as nodes) and
   * edges (as links) lists for the force graph drawing.
   */
  getGraphData(oldData = {nodes: [], links: []}) {
    const nodes = [];
    const links = [];
    for (const v of this.getVertices()) {
      const node = {"id": v, "active": this.activeVertices.has(v.toString()), "recentlyInfected": this.recentlyInfected.has(v)};
      const oldNode = oldData.nodes.find(nod => nod.id === v);

      if (oldNode !== undefined) {
        nodes.push({...oldNode, ...node});
        nodes[nodes.length - 1].index = nodes.length - 1; // TODO: necessary?
      } else {
        nodes.push(node);
      }
    }

    for (const [source, target] of this.getEdges()) {
      const forceLink = {"source": nodes[source], "target": nodes[target]};
      const oldForceLink = oldData.links.find(link => link.source.id === source && link.target.id === target);

      if (oldForceLink !== undefined) {
        links.push({...oldForceLink, ...forceLink});
        links[links.length - 1].index = links.length - 1; // TODO: necessary?
      } else {
        links.push(forceLink);
      }
    }

    return {nodes, links};
  }
}

/*
 * This file is part of Booper, a bootstrap percolation visualization tool.
 * Copyright (C) 2020-2021 Connor Anderson <canderson@thaumavor.io>, Akshaj
 * Balasubramanian <bakshaj99@gmail.com>, Henry Poskanzer <hposkanzer@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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
    for (const v of vs) {
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
    for(const v of this.getVertices()) {
      if(Math.random() < inclusionProbability){
        this.activateVertex(v);
      }
    }
    return this;
  }

  // Peform one bootstap percolation iteration.
  // For each vertex, if it has enough active neighbors, it is activated with the given probability.
  // If any inactive vertices had enough active neighbors, return false. Otherwise, return true.
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

  *getEdges() {
    for (const v of this.getVertices()) {
      for (const n of this.getNeighbors(v)) {
        if (v < n) { // TODO: assumes simple. is this ok?
          yield [v,n];
        }
      }
    }
  }

  getWebGraphJSON() {
    return JSON.stringify({ webGraphVertices: Array.from(this.getVertices()), webGraphEdges: Array.from(this.getEdges()) });
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

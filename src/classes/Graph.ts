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
/** @module Graph */

import type { GraphData, NodeObject, LinkObject } from "react-force-graph-2d";

type Vertex = number;

/**
 * A simple graph capable of being used in activation processes.
 */
export default class Graph {
  private adj = new Map<Vertex, Set<Vertex>>();
  private activeVertices = new Set<Vertex>();   // All active vertices
  private recentlyInfected = new Set<Vertex>(); // Vertices that were infected in the most recent percolation iteration

  /**
   * Adds a vertex to the graph.
   *
   * By default, the new vertex has no adjacent vertices.
   * @param {Vertex} v The vertex to add.
   */
  addVertex(v: Vertex): void {
    this.adj.set(v, new Set());
  }

  /**
   * Adds an edge to the graph.
   * @param {Vertex} u The first of the two vertices in the edge.
   * @param {Vertex} v The second of the two vertices in the edge.
   */
  addEdge(u: Vertex, v: Vertex): void {
    const neighbors1 = this.adj.get(u);
    const neighbors2 = this.adj.get(v);

    if (neighbors1 === undefined || neighbors2 === undefined) {
      throw new Error("Vertex does not exist");
    }

    neighbors1.add(v);
    neighbors2.add(u);
  }

  /**
   * Returns the vertex set.
   * @returns {iterable} An iterable over the vertices of the graph.
   */
  getVertices(): Iterable<Vertex> {
    return this.adj.keys();
  }

  /**
   * Returns the set of neighbors of the given vertex.
   * @param {Vertex} v The vertex whose neighborhood we will return.
   * @returns {Set<Vertex>} An set of the neighbors of the given vertex.
   */
  getNeighbors(v: Vertex): Set<Vertex> {
    const neighbors = this.adj.get(v);

    if (neighbors === undefined) {
      throw new Error("Vertex does not exist");
    }

    return neighbors;
  }

  /**
   * Returns the degree of the given vertex.
   * @param {Vertex} v The vertex whose degree we will return.
   * @returns {number} The degree of the given vertex.
   */
  getDegree(v: Vertex): number {
    return this.getNeighbors(v).size;
  }

  /**
   * Returns the Vertex of active vertices in the graph.
   * @returns {Vertex} The Vertex of active vertices in the graph.
   */
  getActiveVerticesCount(): number {
    return this.activeVertices.size;
  }

  /**
   * Activates the given vertex in the graph.
   *
   * If the vertex is already active, this is equivalent to doing nothing.
   * @param {Vertex} v The vertex to activate.
   * @return {Set<Vertex>} The set of active vertices after the addition of the vertex.
   */
  activateVertex(v: Vertex): Set<Vertex> {
    console.log("Activate Vertex call: " + v.toString());
    return this.activeVertices.add(v);
  }

  /**
   * Activates the given vertices in the graph.
   * @param {Iterable<Vertex>} vs The vertices to activate.
   * @return {Graph} The graph.
   */
  activateVertices(vs: Iterable<Vertex>): this {
    for (const v of vs) {
      this.activateVertex(v);
    }
    return this;
  }

  /**
   * Deactivates all vertices in the graph.
   * @return {Graph} The graph.
   */
  deactivateAllVertices(): this {
    this.activeVertices.clear();
    this.recentlyInfected.clear();
    return this;
  }

  /**
   * First deactivates every vertex in the graph, then iterates through every
   * vertex in the graph, activating each with the given probability.
   * @param {number} inclusionProbability The probability that a vertex will be activated.
   * @return {Graph} The graph.
   */
  randomSeedSet(inclusionProbability: number): this {
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
  bootstrapPercolationIteration(threshold: number, infectionProbability: number): boolean {
    const vertices = this.getVertices();
    this.recentlyInfected.clear();
    let done = true;

    for (const v of vertices) {
      console.log("Looking at", v);

      if (this.activeVertices.has(v)) {
        console.log("\tIt's already active.");
        continue;
      }

      const neighbors = this.getNeighbors(v);
      let count = 0;
      for (const n of neighbors) {
        if (this.activeVertices.has(n)) {
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
  *getEdges(): Generator<Vertex[]> {
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
  getWebGraphJSON(): string {
    return JSON.stringify({ webGraphVertices: Array.from(this.getVertices()), webGraphEdges: Array.from(this.getEdges()) });
  }

  /**
   * Approximates a minimum contagious set by contacting the back-end server
   * which greedily finds such a set.
   * @param {threshold} threshold The threshold we use for bootstrap
   * percolation.
   * @return {Promise<string>} A Promise whose result will be a vertex list
   * which approximates a minimal contagious set of the graph.
   */
  findContagiousSetGreedily(threshold: number): Promise<string> {
    return fetch(`https://thaumic.dev/booper/greedy?graph=${this.getWebGraphJSON()}&threshold=${threshold}`)
      .then(res => res.json());
  }

  /**
   * Returns a minimum contagious set by contacting the back-end server
   * which finds such a set.
   * @param {threshold} threshold The threshold we use for bootstrap
   * percolation.
   * @return {Promise<string>} A Promise whose result will be a vertex list
   * which represents a minimal contagious set of the graph.
   */
  findMinimalContagiousSet(threshold: number): Promise<string> {
    return fetch(`https://thaumic.dev/booper/min?graph=${this.getWebGraphJSON()}&threshold=${threshold}`)
      .then(res => res.json());
  }

  /**
   * Given the old force graph data, returns an updated graph data list with
   * current vertex and edge information.
   * @param {GraphData} [oldData = {nodes: [], links: []}] An object containing
   * the vertices (as nodes) and edges (as links) lists from the old force
   * graph data.
   * @return {GraphData} An object containing the update vertices (as nodes) and
   * edges (as links) lists for the force graph drawing.
   */
  getGraphData(oldData: GraphData = {nodes: [], links: []}): GraphData {
    const nodes: (NodeObject & { index?: number })[] = [];
    const links: (LinkObject & { index?: number })[] = [];
    for (const v of this.getVertices()) {
      const node = {"id": v, "active": this.activeVertices.has(v), "recentlyInfected": this.recentlyInfected.has(v)};
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
      const oldForceLink = oldData.links.find(link => (typeof link.source === "object" && link.source.id === source)
                                                && (typeof link.target === "object" && link.target.id === target));

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

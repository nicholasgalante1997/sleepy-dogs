import IGraph, { Relationship } from '../../types/Signal/Graph.js';

export default class Graph<V> implements IGraph<V> {
  /**
   * Digraph - Directional Graph
   * Each map key is a vertex of type V which is a reference to an entity in the graph,
   * Each map value is a list of type Relationship<V> which expresses a relationship,
   * that that vertex maintains to another vertex within the graph.
   * This implementation choice is known as an adjacencyList,
   * where each key is an entity in the graph,
   * and each value represents a collection of edges that that vertex (key) maintains
   */
  private adjacencyList: Map<V, Relationship<V>[]>;

  constructor() {
    this.adjacencyList = new Map();
  }

  addVertex(vertex: V): void {
    if (this.adjacencyList.has(vertex)) return;
    this.adjacencyList.set(vertex, []);
  }

  addEdge(relationship: Relationship<V>): void {
    Object.values(relationship).forEach((vertex) => {
      if (!this.adjacencyList.has(vertex)) this.addVertex(vertex);
    });

    const providingVertex = relationship.provider;
    const dependents = this.getEdges(providingVertex);

    this.adjacencyList.set(providingVertex, [...dependents, relationship]);
  }

  getEdges(vertex: V): Relationship<V>[] {
    return this.adjacencyList.get(vertex) || [];
  }
}

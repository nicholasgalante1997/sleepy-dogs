import IGraph, { Relationship } from '../../types/Signal/Graph.js';

export default class Graph<V> implements IGraph<V> {
  /**
   * Digraph - Directional Graph
   * Each map key is a vertex of type V which is a reference to an entity (node) in the graph,
   * Each map value is a list of type Relationship<V> which expresses a relationship,
   * that that vertex maintains to another vertex within the graph (an edge).
   * This implementation choice is known as an adjacencyList,
   * where each key is a node/vertex in the graph,
   * and each value represents a collection of edges that that vertex maintains
   */
  private adjacencyList: Map<V, Relationship<V>[]>;

  /**
   * Constructor for the Graph class.
   * Creates a new empty graph.
   */
  constructor() {
    this.adjacencyList = new Map();
  }

  /**
   * Adds a node to the graph
   * @param vertex The vertex (node) to be added to the graph
   * If the vertex already exists in the graph, no action is taken.
   */
  addVertex(vertex: V): void {
    if (this.adjacencyList.has(vertex)) return;
    this.adjacencyList.set(vertex, []);
  }

  removeVertex(vertex: V): void {
    if (this.adjacencyList.has(vertex)) this.adjacencyList.delete(vertex);
    for (const [k, v] of this.adjacencyList.entries()) {
      this.adjacencyList.set(k, v.filter((r) => r.provider !== vertex && r.dependent !== vertex));
    }
  }

  /**
   * Adds an edge between two nodes to the graph
   * 
   * If either or neither node exists, they are inserted prior to the edge.
   * 
   * @param relationship The relationship (edge) to be added to the graph, 
   * which is a tuple of type Relationship<V> that expresses a relationship,
   * that one vertex maintains to another vertex within the graph.
   * */
  addEdge(relationship: Relationship<V>): void {
    Object.values(relationship).forEach((vertex) => {
      if (!this.adjacencyList.has(vertex)) this.addVertex(vertex);
    });

    const providingVertex = relationship.provider;
    const dependents = this.getEdges(providingVertex);

    this.adjacencyList.set(providingVertex, [...dependents, relationship]);
  }

  /**
   * Gets all edges connected to a node (vertex)
   * @param vertex The node (vertex) for which to retrieve connected edges
   * @returns An array of type Relationship<V>[] that represents all edges connected to the given vertex
   */
  getEdges(vertex: V): Relationship<V>[] {
    return this.adjacencyList.get(vertex) || [];
  }

  /**
   * Gets all nodes in the graph
   * @returns An array of type V[] that contains all vertices in the graph
   */
  getVertices(): V[] {
    return Array.from(this.adjacencyList.keys());
  }

  forEach(callback: (entry: [V, Relationship<V>[]]) => void) {
    this.adjacencyList.forEach((value, key, map) => callback([key, value]));
  }

  get size() {
    return this.adjacencyList.size;
  }
}

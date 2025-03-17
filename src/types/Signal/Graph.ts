/**
 * This is the lowest possible implementation for a generic Graph structure.
 * You can add any number of nodes (Vertices) and create an arbitrary number
 * of edges (relationships) between them.
 * 
 * In implementation, this class will maintain an adjacency list,
 * however Typescript does not allow for private interface fields,
 * so `adjacencyList` must be implemented in child classes,
 * and is left out of this interface.
 */
export default interface IGraph<Vertex> {
  /**
   * Adds a node to the graph
   * @param vertex 
   */
  addVertex(vertex: Vertex): void;

  /** 
   * Adds an edge between two nodes to the graph
   * 
   * If either or neither node exists, they are inserted prior to the edge.
   */
  addEdge(relationship: Relationship<Vertex>): void;

  /**
   * Gets all edges connected to a node (vertex)
   * @param vertex 
   */
  getEdges(vertex: Vertex): Relationship<Vertex>[];

  /** 
   * Gets all nodes in the graph
   */
  getVertices(): Vertex[];

  /**
   * Gets the number of nodes in the graph
   */
  size: number

  /**
   * Perform a callback on each node present in the graph;
   * @param callback 
   */
  forEach(callback: (entry: [Vertex, Relationship<Vertex>[]]) => void): void;
}

/**
 * 
 */
export interface Relationship<Vertex> {
  provider: Vertex;
  dependent: Vertex;
}

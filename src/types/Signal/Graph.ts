export default interface IGraph<Vertex> {
  adjacencyList: Map<Vertex, Relationship<Vertex>[]>;
  addVertex(vertex: Vertex): void;
  addEdge(relationship: Relationship<Vertex>): void;
  getEdges(vertex: Vertex): Relationship<Vertex>[];
}

export interface Relationship<Vertex> {
  provider: Vertex;
  dependent: Vertex;
}

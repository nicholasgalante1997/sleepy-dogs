import Graph from '../../src/models/Signal/Graph.js';

describe('Graph', () => {
    test('Adds a point to a graph', () => {
        const graph = new Graph<number>();
        graph.addVertex(4);
        expect(graph.size).toBe(1);
    });
})
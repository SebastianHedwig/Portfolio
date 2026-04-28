import { NetworkEdge, NetworkNodeSeed } from './viewport-background.models'
import { DisjointSet } from './viewport-background.network-disjoint-set'
import {
  EdgeBuildContext,
  EdgeSelectionPass,
  NodePair,
} from './viewport-background.network-types'
import { clamp, createSeededRandom } from './viewport-background.network-utils'

export function createStableClusterEdges(
  nodes: NetworkNodeSeed[],
  maxDistance: number,
  maxNeighborsPerNode: number,
  clusterSeed: number,
): NetworkEdge[] {
  const context = createEdgeBuildContext(nodes, maxDistance, maxNeighborsPerNode, clusterSeed)
  addAngularRingEdges(context)
  connectSeparatedGroups(context)
  addScoredEdgePasses(context, maxNeighborsPerNode)
  addNearestNeighborEdges(context)
  return context.edges
}

export function createAdjacencySets(nodeCount: number, edges: NetworkEdge[]): Set<number>[] {
  const adjacency = Array.from({ length: nodeCount }, () => new Set<number>())
  edges.forEach((edge) => addEdgeToAdjacency(adjacency, edge))
  return adjacency
}
export function countSharedNeighbors(left: Set<number>, right: Set<number>): number {
  let count = 0
  for (const value of left) {
    count += right.has(value) ? 1 : 0
  }
  return count
}
function createEdgeBuildContext(
  nodes: NetworkNodeSeed[],
  maxDistance: number,
  maxNeighborsPerNode: number,
  clusterSeed: number,
): EdgeBuildContext {
  const weaveBoost = clamp((nodes.length - 12) / 12, 0, 1)
  return createEdgeContext(nodes, maxDistance, clusterSeed, maxNeighborsPerNode, weaveBoost)
}
function createEdgeContext(
  nodes: NetworkNodeSeed[],
  maxDistance: number,
  clusterSeed: number,
  maxNeighborsPerNode: number,
  weaveBoost: number,
): EdgeBuildContext {
  return {
    nodes,
    edges: [],
    edgeKeys: new Set<string>(),
    connectionsPerNode: new Array<number>(nodes.length).fill(0),
    allPairs: collectNodePairs(nodes),
    densityBiases: createNodeDensityBiases(nodes, clusterSeed, maxDistance),
    maxDistance,
    baseConnectionLimit: maxNeighborsPerNode + 1 + Math.round(weaveBoost),
    weaveBoost,
  }
}
function addAngularRingEdges(context: EdgeBuildContext): void {
  const angularOrder = [...context.nodes].sort(compareNodeAngles)
  for (let index = 0; index < angularOrder.length; index += 1) {
    addAngularRingEdge(context, angularOrder, index)
  }
}
function addAngularRingEdge(
  context: EdgeBuildContext,
  angularOrder: NetworkNodeSeed[],
  index: number,
): void {
  const current = angularOrder[index]
  const next = angularOrder[(index + 1) % angularOrder.length]
  if (readNodeDistance(current, next) <= context.maxDistance * 1.28) {
    addStableEdge(context, current.id, next.id, context.baseConnectionLimit)
  }
}
function connectSeparatedGroups(context: EdgeBuildContext): void {
  const groups = createDisjointSet(context.nodes.length, context.edges)
  for (const pair of context.allPairs) {
    connectSeparatedPair(context, groups, pair)
  }
}

function connectSeparatedPair(
  context: EdgeBuildContext,
  groups: DisjointSet,
  pair: NodePair,
): void {
  if (pair.distance > context.maxDistance * 1.34) {
    return
  }
  addPairIfSeparated(context, groups, pair)
}

function addPairIfSeparated(
  context: EdgeBuildContext,
  groups: DisjointSet,
  pair: NodePair,
): void {
  if (groups.find(pair.a) === groups.find(pair.b)) {
    return
  }
  if (addStableEdge(context, pair.a, pair.b, context.baseConnectionLimit)) {
    groups.union(pair.a, pair.b)
  }
}

function addScoredEdgePasses(
  context: EdgeBuildContext,
  maxNeighborsPerNode: number,
): void {
  const adjacency = createAdjacencySets(context.nodes.length, context.edges)
  for (const pass of createEdgeSelectionPasses(context, maxNeighborsPerNode)) {
    runEdgeSelectionPass(context, adjacency, pass)
  }
}

function runEdgeSelectionPass(
  context: EdgeBuildContext,
  adjacency: Set<number>[],
  pass: EdgeSelectionPass,
): void {
  let addedEdges = 0
  for (const pair of context.allPairs) {
    addedEdges = tryAddScoredEdge(context, adjacency, pass, pair, addedEdges)
    if (addedEdges >= pass.maxEdges) {
      break
    }
  }
}

function tryAddScoredEdge(
  context: EdgeBuildContext,
  adjacency: Set<number>[],
  pass: EdgeSelectionPass,
  pair: NodePair,
  addedEdges: number,
): number {
  if (!shouldAddScoredEdge(context, adjacency, pass, pair)) {
    return addedEdges
  }
  return addScoredEdge(context, adjacency, pass, pair, addedEdges)
}

function addScoredEdge(
  context: EdgeBuildContext,
  adjacency: Set<number>[],
  pass: EdgeSelectionPass,
  pair: NodePair,
  addedEdges: number,
): number {
  if (!addStableEdge(context, pair.a, pair.b, pass.connectionLimit)) {
    return addedEdges
  }
  addAdjacencyPair(adjacency, pair.a, pair.b)
  return addedEdges + 1
}

function shouldAddScoredEdge(
  context: EdgeBuildContext,
  adjacency: Set<number>[],
  pass: EdgeSelectionPass,
  pair: NodePair,
): boolean {
  if (pair.distance > context.maxDistance * pass.maxDistanceScale) {
    return false
  }
  return readPairScore(context, adjacency, pass, pair) >= pass.threshold
}

function readPairScore(
  context: EdgeBuildContext,
  adjacency: Set<number>[],
  pass: EdgeSelectionPass,
  pair: NodePair,
): number {
  const shared = countSharedNeighbors(adjacency[pair.a], adjacency[pair.b])
  if (shared < pass.minSharedNeighbors) {
    return Number.NEGATIVE_INFINITY
  }
  return calculatePairScore(context, pass, pair, shared)
}

function calculatePairScore(
  context: EdgeBuildContext,
  pass: EdgeSelectionPass,
  pair: NodePair,
  shared: number,
): number {
  const compactness = 1 - pair.distance / (context.maxDistance * pass.maxDistanceScale)
  const density = (context.densityBiases[pair.a] + context.densityBiases[pair.b]) * 0.5
  return shared * pass.sharedWeight + density * pass.densityWeight
    + compactness * pass.compactnessWeight
}

function addNearestNeighborEdges(context: EdgeBuildContext): void {
  for (const node of context.nodes) {
    addNearestNeighborEdgesForNode(context, node)
  }
}

function addNearestNeighborEdgesForNode(
  context: EdgeBuildContext,
  node: NetworkNodeSeed,
): void {
  for (const pair of readNearestPairs(context, node.id)) {
    if (context.connectionsPerNode[node.id] >= context.baseConnectionLimit) {
      break
    }
    addNearestPairEdge(context, node.id, pair)
  }
}

function addNearestPairEdge(context: EdgeBuildContext, nodeId: number, pair: NodePair): void {
  const neighborId = pair.a === nodeId ? pair.b : pair.a
  addStableEdge(context, nodeId, neighborId, context.baseConnectionLimit)
}

function readNearestPairs(context: EdgeBuildContext, nodeId: number): NodePair[] {
  return context.allPairs
    .filter((pair) => pair.a === nodeId || pair.b === nodeId)
    .filter((pair) => pair.distance <= context.maxDistance)
}

function createEdgeSelectionPasses(
  context: EdgeBuildContext,
  maxNeighborsPerNode: number,
): EdgeSelectionPass[] {
  return [
    createSecondaryEdgePass(context, maxNeighborsPerNode),
    createTertiaryEdgePass(context),
    createQuaternaryEdgePass(context),
  ]
}

function createSecondaryEdgePass(
  context: EdgeBuildContext,
  maxNeighborsPerNode: number,
): EdgeSelectionPass {
  const threshold = (maxNeighborsPerNode >= 4 ? 0.5 : 0.58) - context.weaveBoost * 0.06
  const maxEdges = Math.floor(context.nodes.length * readSecondaryEdgeRatio(context, maxNeighborsPerNode))
  return createEdgeSelectionPass(0.82, threshold, maxEdges, 1, context.baseConnectionLimit + 1)
}

function readSecondaryEdgeRatio(
  context: EdgeBuildContext,
  maxNeighborsPerNode: number,
): number {
  return maxNeighborsPerNode >= 4 ? 0.52 : 0.34 + context.weaveBoost * 0.18
}

function createTertiaryEdgePass(context: EdgeBuildContext): EdgeSelectionPass {
  const maxEdges = Math.floor(context.nodes.length * (0.28 + 0.22 * context.weaveBoost))
  return createEdgeSelectionPass(0.62, 0.8 - context.weaveBoost * 0.08, maxEdges, 2, context.baseConnectionLimit + 2)
}

function createQuaternaryEdgePass(context: EdgeBuildContext): EdgeSelectionPass {
  const maxEdges = Math.floor(context.nodes.length * (0.14 + 0.16 * context.weaveBoost))
  const limit = context.baseConnectionLimit + 2 + (context.weaveBoost > 0.5 ? 1 : 0)
  return createEdgeSelectionPass(0.48, 1 - context.weaveBoost * 0.1, maxEdges, 2, limit)
}

function createEdgeSelectionPass(
  maxDistanceScale: number,
  threshold: number,
  maxEdges: number,
  minSharedNeighbors: number,
  connectionLimit: number,
): EdgeSelectionPass {
  return {
    maxDistanceScale,
    threshold,
    maxEdges: Math.max(1, maxEdges),
    minSharedNeighbors,
    connectionLimit,
    sharedWeight: readSharedWeight(maxDistanceScale),
    densityWeight: readDensityWeight(maxDistanceScale),
    compactnessWeight: readCompactnessWeight(maxDistanceScale),
  }
}

function readSharedWeight(maxDistanceScale: number): number {
  return maxDistanceScale === 0.82 ? 0.32 : maxDistanceScale === 0.62 ? 0.4 : 0.46
}

function readDensityWeight(maxDistanceScale: number): number {
  return maxDistanceScale === 0.82 ? 0.42 : maxDistanceScale === 0.62 ? 0.38 : 0.34
}

function readCompactnessWeight(maxDistanceScale: number): number {
  return maxDistanceScale === 0.82 ? 0.26 : maxDistanceScale === 0.62 ? 0.22 : 0.2
}

function addStableEdge(
  context: EdgeBuildContext,
  a: number,
  b: number,
  connectionLimit: number,
): boolean {
  if (isNodeAtConnectionLimit(context, a, b, connectionLimit)) {
    return false
  }
  return addUniqueStableEdge(context, a, b)
}

function addUniqueStableEdge(context: EdgeBuildContext, a: number, b: number): boolean {
  const key = createEdgeKey(a, b)
  if (context.edgeKeys.has(key)) {
    return false
  }
  writeStableEdge(context, a, b, key)
  return true
}

function writeStableEdge(context: EdgeBuildContext, a: number, b: number, key: string): void {
  context.edgeKeys.add(key)
  context.connectionsPerNode[a] += 1
  context.connectionsPerNode[b] += 1
  context.edges.push({ a, b })
}

function isNodeAtConnectionLimit(
  context: EdgeBuildContext,
  a: number,
  b: number,
  connectionLimit: number,
): boolean {
  return context.connectionsPerNode[a] >= connectionLimit
    || context.connectionsPerNode[b] >= connectionLimit
}

function collectNodePairs(nodes: NetworkNodeSeed[]): NodePair[] {
  const pairs: NodePair[] = []
  for (let leftIndex = 0; leftIndex < nodes.length; leftIndex += 1) {
    collectNodePairsForLeft(nodes, pairs, leftIndex)
  }
  return pairs.sort((left, right) => left.distance - right.distance)
}

function collectNodePairsForLeft(
  nodes: NetworkNodeSeed[],
  pairs: NodePair[],
  leftIndex: number,
): void {
  for (let rightIndex = leftIndex + 1; rightIndex < nodes.length; rightIndex += 1) {
    pairs.push(createNodePair(nodes[leftIndex], nodes[rightIndex]))
  }
}

function createNodePair(left: NetworkNodeSeed, right: NetworkNodeSeed): NodePair {
  return {
    a: left.id,
    b: right.id,
    distance: readNodeDistance(left, right),
  }
}

function createNodeDensityBiases(
  nodes: NetworkNodeSeed[],
  clusterSeed: number,
  maxDistance: number,
): number[] {
  const phases = createDensityPhases(clusterSeed)
  return nodes.map((node) => readNodeDensityBias(node, phases, maxDistance))
}

function createDensityPhases(clusterSeed: number): { phaseA: number; phaseB: number } {
  const random = createSeededRandom(clusterSeed ^ 0x85ebca6b)
  return { phaseA: random() * Math.PI * 2, phaseB: random() * Math.PI * 2 }
}

function readNodeDensityBias(
  node: NetworkNodeSeed,
  phases: { phaseA: number; phaseB: number },
  maxDistance: number,
): number {
  const x = node.x / Math.max(maxDistance, 1)
  const y = node.y / Math.max(maxDistance, 1)
  const interiorBias = readInteriorDensityBias(x, y)
  return clamp(readDensityField(x, y, phases) * 0.58 + interiorBias * 0.42, 0, 1)
}

function readInteriorDensityBias(x: number, y: number): number {
  const radius = Math.hypot(x, y)
  return 1 - clamp(Math.abs(radius - 0.58) / 0.58, 0, 1)
}

function readDensityField(
  x: number,
  y: number,
  phases: { phaseA: number; phaseB: number },
): number {
  const field = Math.sin(x * 2.2 + phases.phaseA) * 0.5
    + Math.cos(y * 1.7 + phases.phaseB) * 0.35
    + Math.sin((x - y) * 1.4 + phases.phaseA * 0.5) * 0.15
  return field * 0.5 + 0.5
}

function createDisjointSet(nodeCount: number, edges: NetworkEdge[]): DisjointSet {
  const groups = new DisjointSet(nodeCount)
  edges.forEach((edge) => groups.union(edge.a, edge.b))
  return groups
}

function addEdgeToAdjacency(adjacency: Set<number>[], edge: NetworkEdge): void {
  addAdjacencyPair(adjacency, edge.a, edge.b)
}

function addAdjacencyPair(adjacency: Set<number>[], a: number, b: number): void {
  adjacency[a].add(b)
  adjacency[b].add(a)
}

function compareNodeAngles(left: NetworkNodeSeed, right: NetworkNodeSeed): number {
  return Math.atan2(left.y, left.x) - Math.atan2(right.y, right.x)
}

function readNodeDistance(left: NetworkNodeSeed, right: NetworkNodeSeed): number {
  return Math.hypot(right.x - left.x, right.y - left.y)
}

function createEdgeKey(a: number, b: number): string {
  return a < b ? `${a}:${b}` : `${b}:${a}`
}

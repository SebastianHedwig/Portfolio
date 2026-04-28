import { NetworkEdge, NetworkNodeSeed } from './viewport-background.models'
import { createAdjacencySets } from './viewport-background.network-edges'
import { clamp, createSeededRandom } from './viewport-background.network-utils'

interface ScoredPulseNode {
  id: number
  score: number
}

export function selectPulseNodeIndices(
  nodes: NetworkNodeSeed[],
  edges: NetworkEdge[],
  clusterSeed: number,
  desiredCount: number,
): number[] {
  const adjacency = createAdjacencySets(nodes.length, edges)
  const scored = scorePulseNodes(nodes, adjacency, clusterSeed)
  return selectPulseNodes(scored, adjacency, clamp(desiredCount, 0, nodes.length))
}

function scorePulseNodes(
  nodes: NetworkNodeSeed[],
  adjacency: Set<number>[],
  clusterSeed: number,
): ScoredPulseNode[] {
  const random = createSeededRandom(clusterSeed ^ 0xc2b2ae35)
  const maxRadius = Math.max(...nodes.map(readNodeRadius), 1)
  return nodes.map((node) => scorePulseNode(node, adjacency, random, maxRadius))
    .sort((left, right) => right.score - left.score)
}

function scorePulseNode(
  node: NetworkNodeSeed,
  adjacency: Set<number>[],
  random: () => number,
  maxRadius: number,
): ScoredPulseNode {
  const radiusRatio = clamp(readNodeRadius(node) / maxRadius, 0, 1)
  const interiorBias = 1 - clamp(Math.abs(radiusRatio - 0.56) / 0.56, 0, 1)
  const score = adjacency[node.id].size * 0.58 + interiorBias * 0.32 + random() * 0.1
  return { id: node.id, score }
}

function selectPulseNodes(
  scored: ScoredPulseNode[],
  adjacency: Set<number>[],
  targetCount: number,
): number[] {
  const selection = selectSeparatedPulseNodes(scored, adjacency, targetCount)
  fillPulseSelection(scored, selection, targetCount)
  return selection
}

function selectSeparatedPulseNodes(
  scored: ScoredPulseNode[],
  adjacency: Set<number>[],
  targetCount: number,
): number[] {
  const selection: number[] = []
  for (const candidate of scored) {
    addSeparatedPulseCandidate(candidate, adjacency, selection, targetCount)
  }
  return selection
}

function addSeparatedPulseCandidate(
  candidate: ScoredPulseNode,
  adjacency: Set<number>[],
  selection: number[],
  targetCount: number,
): void {
  if (selection.length >= targetCount || isAdjacentToSelection(candidate, adjacency, selection)) {
    return
  }
  selection.push(candidate.id)
}

function fillPulseSelection(
  scored: ScoredPulseNode[],
  selection: number[],
  targetCount: number,
): void {
  for (const candidate of scored) {
    addPulseCandidate(candidate, selection, targetCount)
  }
}

function addPulseCandidate(
  candidate: ScoredPulseNode,
  selection: number[],
  targetCount: number,
): void {
  if (selection.length < targetCount && !selection.includes(candidate.id)) {
    selection.push(candidate.id)
  }
}

function isAdjacentToSelection(
  candidate: ScoredPulseNode,
  adjacency: Set<number>[],
  selection: number[],
): boolean {
  return selection.some((selected) => adjacency[selected].has(candidate.id))
}

function readNodeRadius(node: NetworkNodeSeed): number {
  return Math.hypot(node.x, node.y)
}

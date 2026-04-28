import {
  NetworkClusterDefinition,
  NetworkNodeSeed,
} from './viewport-background.models'
import { createSeededRandom } from './viewport-background.network-utils'

interface NodeForce {
  x: number
  y: number
}

export function createRelaxedClusterNodes(
  cluster: NetworkClusterDefinition,
): NetworkNodeSeed[] {
  const nodes = createClusterNodeSeeds(cluster)
  relaxNodeSeeds(nodes, cluster.radius * cluster.aspect, cluster.radius)
  return nodes
}

function createClusterNodeSeeds(cluster: NetworkClusterDefinition): NetworkNodeSeed[] {
  const random = createSeededRandom(cluster.seed)
  const radiusX = cluster.radius * cluster.aspect
  return Array.from({ length: cluster.nodeCount }, (_, index) =>
    createClusterNodeSeed(index, radiusX, cluster.radius, random),
  )
}

function createClusterNodeSeed(
  id: number,
  radiusX: number,
  radiusY: number,
  random: () => number,
): NetworkNodeSeed {
  const angle = random() * Math.PI * 2
  const distance = Math.sqrt(random()) * (0.78 + random() * 0.22)
  return { id, x: Math.cos(angle) * radiusX * distance, y: Math.sin(angle) * radiusY * distance }
}

function relaxNodeSeeds(nodes: NetworkNodeSeed[], radiusX: number, radiusY: number): void {
  for (let iteration = 0; iteration < 20; iteration += 1) {
    relaxNodes(nodes, radiusX, radiusY)
  }
}

function relaxNodes(nodes: NetworkNodeSeed[], radiusX: number, radiusY: number): void {
  for (let index = 0; index < nodes.length; index += 1) {
    relaxNode(nodes, index, radiusX, radiusY)
  }
}

function relaxNode(
  nodes: NetworkNodeSeed[],
  index: number,
  radiusX: number,
  radiusY: number,
): void {
  const current = nodes[index]
  const force = readNodeRelaxationForce(nodes, index, radiusX, radiusY)
  current.x += force.x
  current.y += force.y
  keepNodeInEllipse(current, radiusX, radiusY)
}

function readNodeRelaxationForce(
  nodes: NetworkNodeSeed[],
  index: number,
  radiusX: number,
  radiusY: number,
): NodeForce {
  const current = nodes[index]
  const force = { x: -current.x * 0.018, y: -current.y * 0.018 }
  applyNeighborRepulsion(nodes, index, force, Math.min(radiusX, radiusY) * 0.016)
  return force
}

function applyNeighborRepulsion(
  nodes: NetworkNodeSeed[],
  index: number,
  force: NodeForce,
  strength: number,
): void {
  for (let neighborIndex = 0; neighborIndex < nodes.length; neighborIndex += 1) {
    addNeighborRepulsion(nodes, index, neighborIndex, force, strength)
  }
}

function addNeighborRepulsion(
  nodes: NetworkNodeSeed[],
  index: number,
  neighborIndex: number,
  force: NodeForce,
  strength: number,
): void {
  if (index === neighborIndex) {
    return
  }
  addRepulsionForce(nodes[index], nodes[neighborIndex], force, strength)
}

function addRepulsionForce(
  current: NetworkNodeSeed,
  neighbor: NetworkNodeSeed,
  force: NodeForce,
  strength: number,
): void {
  const dx = current.x - neighbor.x
  const dy = current.y - neighbor.y
  const amount = strength / (dx * dx + dy * dy + 1)
  force.x += dx * amount
  force.y += dy * amount
}

function keepNodeInEllipse(node: NetworkNodeSeed, radiusX: number, radiusY: number): void {
  const ellipse = (node.x * node.x) / (radiusX * radiusX)
    + (node.y * node.y) / (radiusY * radiusY)
  if (ellipse <= 1) {
    return
  }
  scaleNodeIntoEllipse(node, ellipse)
}

function scaleNodeIntoEllipse(node: NetworkNodeSeed, ellipse: number): void {
  const scale = 0.96 / Math.sqrt(ellipse)
  node.x *= scale
  node.y *= scale
}

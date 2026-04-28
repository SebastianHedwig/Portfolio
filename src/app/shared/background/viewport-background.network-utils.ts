import { Vector2 } from 'three'

import {
  BackgroundViewport,
  NetworkClusterDefinition,
} from './viewport-background.models'

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => nextSeededRandomValue((state += 0x6d2b79f5))
}

export function normalized(x: number, y: number): { x: number; y: number } {
  const length = Math.hypot(x, y) || 1
  return { x: x / length, y: y / length }
}

export function projectAnchor(
  cluster: NetworkClusterDefinition,
  viewport: BackgroundViewport,
): Vector2 {
  return new Vector2(
    cluster.anchorX * viewport.width * 0.5,
    cluster.anchorY * viewport.height * 0.5,
  )
}

export function softContain(value: number, innerLimit: number, outerLimit: number): number {
  const sign = Math.sign(value) || 1
  const contained = containAbsoluteValue(Math.abs(value), innerLimit, outerLimit)
  return sign * contained
}

function nextSeededRandomValue(state: number): number {
  let value = Math.imul(state ^ (state >>> 15), 1 | state)
  value ^= value + Math.imul(value ^ (value >>> 7), 61 | value)
  return ((value ^ (value >>> 14)) >>> 0) / 4294967296
}

function containAbsoluteValue(value: number, innerLimit: number, outerLimit: number): number {
  if (value <= innerLimit) {
    return value
  }
  return compressOverflow(value, innerLimit, outerLimit)
}

function compressOverflow(value: number, innerLimit: number, outerLimit: number): number {
  const falloff = Math.max(outerLimit - innerLimit, 1)
  const overflow = value - innerLimit
  const compressed = innerLimit + falloff * Math.tanh((overflow / falloff) * 1.18)
  return Math.min(compressed, outerLimit)
}

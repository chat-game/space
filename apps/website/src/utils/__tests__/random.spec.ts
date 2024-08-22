import { getMinusOrPlus, getRandomInRange } from '../random'
import { describe, expect, it } from 'vitest'

describe('getRandomInRange()', () => {
  it('returns a number within the range', () => {
    const result = getRandomInRange(1, 5)
    expect(result).toBeGreaterThanOrEqual(1)
    expect(result).toBeLessThanOrEqual(5)
  })

  it('handles the edge case of min equal to max', () => {
    const result = getRandomInRange(3, 3)
    expect(result).toBe(3)
  })

  it('handles the edge case of negative range', () => {
    const result = getRandomInRange(-5, -1)
    expect(result).toBeGreaterThanOrEqual(-5)
    expect(result).toBeLessThanOrEqual(-1)
  })
})

describe('getMinusOrPlus()', () => {
  it('returns 1 or -1', () => {
    const result = getMinusOrPlus()
    expect(result).toBeGreaterThanOrEqual(-1)
    expect(result).toBeLessThanOrEqual(1)
    expect(result).not.toBe(0)
  })
})

import { describe, expect, it } from 'vitest'
import { getRandomInRange } from '$lib/utils/random'

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

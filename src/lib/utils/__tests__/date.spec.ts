import { describe, expect, it } from 'vitest'
import { getDateMinusMinutes, getDatePlusMinutes, getDatePlusSeconds } from '$lib/utils/date'

describe('getDatePlusMinutes()', () => {
  it('returns the current date and time plus the specified minutes', () => {
    const now = new Date()
    const minutesToAdd = 5
    const result = getDatePlusMinutes(minutesToAdd)
    const expected = new Date(now.getTime() + minutesToAdd * 60 * 1000)
    expect(result.getTime()).toBeCloseTo(expected.getTime(), 0)
  })

  it('handles the edge case of zero minutes', () => {
    const now = new Date()
    const result = getDatePlusMinutes(0)
    expect(result.getTime()).toBeCloseTo(now.getTime(), 0)
  })

  it('handles the edge case of negative minutes', () => {
    const now = new Date()
    const minutesToAdd = -5
    const result = getDatePlusMinutes(minutesToAdd)
    const expected = new Date(now.getTime() + minutesToAdd * 60 * 1000)
    expect(result.getTime()).toBeCloseTo(expected.getTime(), 0)
  })
})

describe('getDateMinusMinutes()', () => {
  it('returns the current date and time minus the specified minutes', () => {
    const now = new Date()
    const minutesToSubtract = 5
    const result = getDateMinusMinutes(minutesToSubtract)
    const expected = new Date(now.getTime() - minutesToSubtract * 60 * 1000)
    expect(result.getTime()).toBeCloseTo(expected.getTime(), 0)
  })

  it('handles the edge case of zero minutes', () => {
    const now = new Date()
    const result = getDateMinusMinutes(0)
    expect(result.getTime()).toBeCloseTo(now.getTime(), 0)
  })

  it('handles the edge case of negative minutes', () => {
    const now = new Date()
    const minutesToSubtract = -5
    const result = getDateMinusMinutes(minutesToSubtract)
    const expected = new Date(now.getTime() - minutesToSubtract * 60 * 1000)
    expect(result.getTime()).toBeCloseTo(expected.getTime(), 0)
  })
})

describe('getDatePlusSeconds()', () => {
  it('returns the current date and time plus the specified seconds', () => {
    const now = new Date()
    const secondsToAdd = 5
    const result = getDatePlusSeconds(secondsToAdd)
    const expected = new Date(now.getTime() + secondsToAdd * 1000)
    expect(result.getTime()).toBeCloseTo(expected.getTime(), 0)
  })

  it('handles the edge case of zero seconds', () => {
    const now = new Date()
    const result = getDatePlusSeconds(0)
    expect(result.getTime()).toBeCloseTo(now.getTime(), 0)
  })

  it('handles the edge case of negative seconds', () => {
    const now = new Date()
    const secondsToAdd = -5
    const result = getDatePlusSeconds(secondsToAdd)
    const expected = new Date(now.getTime() + secondsToAdd * 1000)
    expect(result.getTime()).toBeCloseTo(expected.getTime(), 0)
  })
})

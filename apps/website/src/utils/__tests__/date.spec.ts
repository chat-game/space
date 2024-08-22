import { getDateMinusMinutes, getDatePlusMinutes, getDatePlusSeconds } from '../date'
import { describe, expect, it } from 'vitest'

describe('getDatePlusMinutes()', () => {
  it('returns the current date and time plus the specified minutes', () => {
    const minutesToAdd = 5
    const result = getDatePlusMinutes(minutesToAdd)
    const expected = new Date(Date.now() + minutesToAdd * 60 * 1000)
    expect(expected.getTime() - result.getTime()).toBeLessThanOrEqual(1)
  })

  it('handles the edge case of zero minutes', () => {
    const result = getDatePlusMinutes(0)
    const expected = new Date()
    expect(expected.getTime() - result.getTime()).toBeLessThanOrEqual(1)
  })

  it('handles the edge case of negative minutes', () => {
    const minutesToAdd = -5
    const result = getDatePlusMinutes(minutesToAdd)
    const expected = new Date(Date.now() + minutesToAdd * 60 * 1000)
    expect(expected.getTime() - result.getTime()).toBeLessThanOrEqual(1)
  })
})

describe('getDateMinusMinutes()', () => {
  it('returns the current date and time minus the specified minutes', () => {
    const minutesToSubtract = 5
    const result = getDateMinusMinutes(minutesToSubtract)
    const expected = new Date(Date.now() - minutesToSubtract * 60 * 1000)
    expect(expected.getTime() - result.getTime()).toBeLessThanOrEqual(1)
  })

  it('handles the edge case of zero minutes', () => {
    const result = getDateMinusMinutes(0)
    const expected = new Date()
    expect(expected.getTime() - result.getTime()).toBeLessThanOrEqual(1)
  })

  it('handles the edge case of negative minutes', () => {
    const minutesToSubtract = -5
    const result = getDateMinusMinutes(minutesToSubtract)
    const expected = new Date(Date.now() - minutesToSubtract * 60 * 1000)
    expect(expected.getTime() - result.getTime()).toBeLessThanOrEqual(1)
  })
})

describe('getDatePlusSeconds()', () => {
  it('returns the current date and time plus the specified seconds', () => {
    const secondsToAdd = 5
    const result = getDatePlusSeconds(secondsToAdd)
    const expected = new Date(Date.now() + secondsToAdd * 1000)
    expect(expected.getTime() - result.getTime()).toBeLessThanOrEqual(1)
  })

  it('handles the edge case of zero seconds', () => {
    const result = getDatePlusSeconds(0)
    const expected = new Date()
    expect(expected.getTime() - result.getTime()).toBeLessThanOrEqual(1)
  })

  it('handles the edge case of negative seconds', () => {
    const secondsToAdd = -5
    const result = getDatePlusSeconds(secondsToAdd)
    const expected = new Date(Date.now() + secondsToAdd * 1000)
    expect(expected.getTime() - result.getTime()).toBeLessThanOrEqual(1)
  })
})

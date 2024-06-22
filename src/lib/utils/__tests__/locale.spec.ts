import { describe, expect, it } from 'vitest'
import { pluralizationRu } from '$lib/utils/locale'

describe('pluralizationRu()', () => {
  it('returns the correct form for singular', () => {
    const result = pluralizationRu(1, ['яблоко', 'яблока', 'яблок'])
    expect(result).toBe('яблоко')
  })

  it('returns the correct form for plural', () => {
    const result = pluralizationRu(5, ['яблоко', 'яблока', 'яблок'])
    expect(result).toBe('яблок')
  })

  it('returns the correct form for numbers ending in 2, 3, 4', () => {
    const result = pluralizationRu(3, ['яблоко', 'яблока', 'яблок'])
    expect(result).toBe('яблока')
  })

  it('handles the edge case of zero', () => {
    const result = pluralizationRu(0, ['яблоко', 'яблока', 'яблок'])
    expect(result).toBe('яблок')
  })

  it('handles the edge case of negative numbers', () => {
    const result = pluralizationRu(-3, ['яблоко', 'яблока', 'яблок'])
    expect(result).toBe('яблока')
  })

  it('handles the edge case of 101 - 110', () => {
    const result = pluralizationRu(102, ['яблоко', 'яблока', 'яблок'])
    expect(result).toBe('яблока')
  })

  it('handles the edge case of 124', () => {
    const result = pluralizationRu(124, ['яблоко', 'яблока', 'яблок'])
    expect(result).toBe('яблока')
  })
})

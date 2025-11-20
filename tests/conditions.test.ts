import { describe, it, expect } from 'vitest';
import {
  eq,
  ne,
  lt,
  lte,
  gt,
  gte,
  anyOf,
  contains,
  startsWith,
  endsWith,
  minLength,
  maxLength,
  truthy,
  isNull,
  isNotNull,
  matches,
  isRecord,
  matchesZodSchema,
} from '../src/conditions';

describe('conditions', () => {
  describe('comparison operators', () => {
    it('eq should return true for equal values', () => {
      expect(eq(5, 5)).toBe(true);
      expect(eq('hello', 'hello')).toBe(true);
      expect(eq(null, null)).toBe(true);
    });

    it('eq should return false for unequal values', () => {
      expect(eq(5, 10)).toBe(false);
      expect(eq('hello', 'world')).toBe(false);
    });

    it('ne should return true for unequal values', () => {
      expect(ne(5, 10)).toBe(true);
      expect(ne('hello', 'world')).toBe(true);
    });

    it('ne should return false for equal values', () => {
      expect(ne(5, 5)).toBe(false);
      expect(ne('hello', 'hello')).toBe(false);
    });

    it('lt should compare numbers correctly', () => {
      expect(lt(5, 10)).toBe(true);
      expect(lt(10, 5)).toBe(false);
      expect(lt(5, 5)).toBe(false);
    });

    it('lte should compare numbers correctly', () => {
      expect(lte(5, 10)).toBe(true);
      expect(lte(5, 5)).toBe(true);
      expect(lte(10, 5)).toBe(false);
    });

    it('gt should compare numbers correctly', () => {
      expect(gt(10, 5)).toBe(true);
      expect(gt(5, 10)).toBe(false);
      expect(gt(5, 5)).toBe(false);
    });

    it('gte should compare numbers correctly', () => {
      expect(gte(10, 5)).toBe(true);
      expect(gte(5, 5)).toBe(true);
      expect(gte(5, 10)).toBe(false);
    });
  });

  describe('string operations', () => {
    it('contains should check string containment', () => {
      expect(contains('hello world', 'world')).toBe(true);
      expect(contains('hello world', 'foo')).toBe(false);
    });

    it('contains should check array containment', () => {
      expect(contains([1, 2, 3], 2)).toBe(true);
      expect(contains([1, 2, 3], 4)).toBe(false);
    });

    it('startsWith should check string prefix', () => {
      expect(startsWith('hello world', 'hello')).toBe(true);
      expect(startsWith('hello world', 'world')).toBe(false);
    });

    it('endsWith should check string suffix', () => {
      expect(endsWith('hello world', 'world')).toBe(true);
      expect(endsWith('hello world', 'hello')).toBe(false);
    });

    it('matches should match regex patterns', () => {
      expect(matches('hello@example.com', /^[\w.-]+@[\w.-]+\.\w+$/)).toBe(true);
      expect(matches('invalid-email', /^[\w.-]+@[\w.-]+\.\w+$/)).toBe(false);
    });

    it('matches should handle string patterns', () => {
      expect(matches('hello', 'hello')).toBe(true);
      expect(matches('hello', '^h.*o$')).toBe(true);
    });
  });

  describe('array operations', () => {
    it('anyOf should check if value is in array', () => {
      expect(anyOf(2, [1, 2, 3])).toBe(true);
      expect(anyOf(4, [1, 2, 3])).toBe(false);
    });

    it('minLength should check minimum length', () => {
      expect(minLength('hello', 3)).toBe(true);
      expect(minLength('hi', 3)).toBe(false);
      expect(minLength([1, 2, 3, 4], 3)).toBe(true);
      expect(minLength([1, 2], 3)).toBe(false);
    });

    it('maxLength should check maximum length', () => {
      expect(maxLength('hello', 10)).toBe(true);
      expect(maxLength('hello', 3)).toBe(false);
      expect(maxLength([1, 2], 3)).toBe(true);
      expect(maxLength([1, 2, 3, 4], 3)).toBe(false);
    });
  });

  describe('null/truthy operations', () => {
    it('truthy should check truthiness', () => {
      expect(truthy(1)).toBe(true);
      expect(truthy('hello')).toBe(true);
      expect(truthy([])).toBe(true);
      expect(truthy(0)).toBe(false);
      expect(truthy('')).toBe(false);
      expect(truthy(null)).toBe(false);
      expect(truthy(undefined)).toBe(false);
    });

    it('isNull should check for null/undefined', () => {
      expect(isNull(null)).toBe(true);
      expect(isNull(undefined)).toBe(true);
      expect(isNull(0)).toBe(false);
      expect(isNull('')).toBe(false);
    });

    it('isNotNull should check for non-null', () => {
      expect(isNotNull(0)).toBe(true);
      expect(isNotNull('')).toBe(true);
      expect(isNotNull(null)).toBe(false);
      expect(isNotNull(undefined)).toBe(false);
    });
  });

  describe('type checking', () => {
    it('isRecord should check for plain objects', () => {
      expect(isRecord({})).toBe(true);
      expect(isRecord({ a: 1 })).toBe(true);
      expect(isRecord([])).toBe(false);
      expect(isRecord(null)).toBe(false);
      expect(isRecord(new Date())).toBe(false);
    });
  });
});


import { describe, it, expect } from 'vitest';
import {
  evaluateCondition,
  filterEntities,
  findFirst,
  matchExists,
  countWhere,
  findWhere,
  registerOperator,
  operatorEvaluators,
} from '../src/evaluator';
import {
  eq,
  ne,
  gt,
  lt,
  contains,
  matches,
  and,
  or,
  isRecord,
  matchesZodSchema,
} from '../src/builders';
import { ConditionOperator } from '../src/types';

describe('evaluator', () => {
  const users = [
    { id: 1, name: 'John', age: 25, email: 'john@example.com', status: 'active', tags: ['vip', 'premium'] },
    { id: 2, name: 'Jane', age: 30, email: 'jane@example.com', status: 'active', tags: ['premium'] },
    { id: 3, name: 'Bob', age: 18, email: 'bob@test.com', status: 'inactive', tags: [] },
    { id: 4, name: 'Alice', age: 35, email: 'alice@example.com', status: 'pending', tags: ['vip'] },
  ];

  describe('evaluateCondition', () => {
    it('should evaluate equality conditions', () => {
      expect(evaluateCondition(users[0], eq('name', 'John'))).toBe(true);
      expect(evaluateCondition(users[0], eq('name', 'Jane'))).toBe(false);
    });

    it('should evaluate comparison conditions', () => {
      expect(evaluateCondition(users[0], gt('age', 18))).toBe(true);
      expect(evaluateCondition(users[0], gt('age', 30))).toBe(false);
      expect(evaluateCondition(users[2], lt('age', 20))).toBe(true);
    });

    it('should evaluate string conditions', () => {
      expect(evaluateCondition(users[0], contains('email', 'example'))).toBe(true);
      expect(evaluateCondition(users[0], matches('email', /@example\.com$/))).toBe(true);
      expect(evaluateCondition(users[2], matches('email', /@example\.com$/))).toBe(false);
    });

    it('should evaluate AND conditions', () => {
      const condition = and(eq('status', 'active'), gt('age', 20));
      expect(evaluateCondition(users[0], condition)).toBe(true);
      expect(evaluateCondition(users[2], condition)).toBe(false);
    });

    it('should evaluate OR conditions', () => {
      const condition = or(eq('status', 'active'), eq('status', 'pending'));
      expect(evaluateCondition(users[0], condition)).toBe(true);
      expect(evaluateCondition(users[1], condition)).toBe(true);
      expect(evaluateCondition(users[2], condition)).toBe(false);
    });

    it('should handle nested conditions', () => {
      const condition = and(
        eq('status', 'active'),
        or(gt('age', 25), contains('tags', 'vip'))
      );
      expect(evaluateCondition(users[0], condition)).toBe(true);
      expect(evaluateCondition(users[1], condition)).toBe(true);
      expect(evaluateCondition(users[2], condition)).toBe(false);
    });

    it('should handle plain object filters', () => {
      expect(evaluateCondition(users[0], { name: 'John', status: 'active' })).toBe(true);
      expect(evaluateCondition(users[0], { name: 'Jane' })).toBe(false);
    });

    it('should handle array filters (AND logic)', () => {
      const filter = [eq('status', 'active'), gt('age', 20)];
      expect(evaluateCondition(users[0], filter)).toBe(true);
      expect(evaluateCondition(users[2], filter)).toBe(false);
    });

    it('should handle null/undefined conditions', () => {
      expect(evaluateCondition(users[0], null)).toBe(true);
      expect(evaluateCondition(users[0], undefined)).toBe(true);
    });

    it('should evaluate isRecord condition', () => {
      expect(evaluateCondition(users[0], isRecord('tags'))).toBe(false); // tags is an array
      const userWithMetadata = { ...users[0], metadata: { role: 'admin' } };
      expect(evaluateCondition(userWithMetadata, isRecord('metadata'))).toBe(true);
    });
  });

  describe('filterEntities', () => {
    it('should filter entities by condition', () => {
      const result = filterEntities(users, eq('status', 'active'));
      expect(result).toHaveLength(2);
      expect(result.map(u => u.name)).toEqual(['John', 'Jane']);
    });

    it('should filter with complex conditions', () => {
      const condition = and(eq('status', 'active'), gt('age', 20));
      const result = filterEntities(users, condition);
      expect(result).toHaveLength(2);
      expect(result.map(u => u.name)).toEqual(['John', 'Jane']);
    });

    it('should return empty array when no matches', () => {
      const result = filterEntities(users, eq('status', 'nonexistent'));
      expect(result).toHaveLength(0);
    });

    it('should return all entities when filter is undefined', () => {
      const result = filterEntities(users);
      expect(result).toHaveLength(4);
    });
  });

  describe('findFirst', () => {
    it('should find first matching entity', () => {
      const result = findFirst(users, eq('status', 'active'));
      expect(result).not.toBeNull();
      expect(result?.name).toBe('John');
    });

    it('should return null when no match', () => {
      const result = findFirst(users, eq('status', 'nonexistent'));
      expect(result).toBeNull();
    });
  });

  describe('matchExists', () => {
    it('should return true when match exists', () => {
      expect(matchExists(users, eq('status', 'active'))).toBe(true);
    });

    it('should return false when no match', () => {
      expect(matchExists(users, eq('status', 'nonexistent'))).toBe(false);
    });

    it('should return true for empty filter when entities exist', () => {
      expect(matchExists(users)).toBe(true);
      expect(matchExists([])).toBe(false);
    });
  });

  describe('countWhere', () => {
    it('should count matching entities', () => {
      expect(countWhere(users, eq('status', 'active'))).toBe(2);
      expect(countWhere(users, gt('age', 25))).toBe(2);
      expect(countWhere(users, eq('status', 'nonexistent'))).toBe(0);
    });
  });

  describe('findWhere', () => {
    it('should filter and paginate results', () => {
      const result = findWhere(users, { filter: eq('status', 'active'), limit: 1, offset: 0 });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('John');
    });

    it('should handle offset', () => {
      const result = findWhere(users, { filter: eq('status', 'active'), limit: 1, offset: 1 });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Jane');
    });

    it('should handle limit without offset', () => {
      const result = findWhere(users, { filter: eq('status', 'active'), limit: 1 });
      expect(result).toHaveLength(1);
    });

    it('should handle pagination without filter', () => {
      const result = findWhere(users, { limit: 2, offset: 1 });
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Jane');
    });
  });

  describe('registerOperator', () => {
    it('should allow registering custom operators', () => {
      const customOp = 'customOp';
      registerOperator(customOp, (fieldValue) => fieldValue === 'custom');
      
      expect(operatorEvaluators[customOp]).toBeDefined();
      
      const entity = { test: 'custom' };
      const condition = { field: 'test', operator: customOp as ConditionOperator, value: null };
      
      expect(evaluateCondition(entity, condition)).toBe(true);
    });

    it('should allow overriding existing operators', () => {
      const originalEvaluator = operatorEvaluators[ConditionOperator.Equal];
      
      registerOperator(ConditionOperator.Equal, () => true);
      expect(evaluateCondition({ test: 'anything' }, eq('test', 'value'))).toBe(true);
      
      // Restore original
      registerOperator(ConditionOperator.Equal, originalEvaluator);
    });
  });
});


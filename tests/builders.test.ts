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
  matchesAll,
  and,
  or,
} from '../src/builders';
import { ConditionOperator } from '../src/types';

describe('builders', () => {
  describe('comparison builders', () => {
    it('eq should create equality condition', () => {
      const condition = eq('age', 25);
      expect(condition).toEqual({
        field: 'age',
        operator: ConditionOperator.Equal,
        value: 25,
      });
    });

    it('ne should create not-equal condition', () => {
      const condition = ne('status', 'inactive');
      expect(condition).toEqual({
        field: 'status',
        operator: ConditionOperator.NotEqual,
        value: 'inactive',
      });
    });

    it('lt should create less-than condition', () => {
      const condition = lt('age', 18);
      expect(condition).toEqual({
        field: 'age',
        operator: ConditionOperator.LessThan,
        value: 18,
      });
    });

    it('lte should create less-than-or-equal condition', () => {
      const condition = lte('score', 100);
      expect(condition).toEqual({
        field: 'score',
        operator: ConditionOperator.LessThanOrEqual,
        value: 100,
      });
    });

    it('gt should create greater-than condition', () => {
      const condition = gt('age', 18);
      expect(condition).toEqual({
        field: 'age',
        operator: ConditionOperator.GreaterThan,
        value: 18,
      });
    });

    it('gte should create greater-than-or-equal condition', () => {
      const condition = gte('score', 0);
      expect(condition).toEqual({
        field: 'score',
        operator: ConditionOperator.GreaterThanOrEqual,
        value: 0,
      });
    });
  });

  describe('string builders', () => {
    it('contains should create contains condition', () => {
      const condition = contains('tags', 'vip');
      expect(condition).toEqual({
        field: 'tags',
        operator: ConditionOperator.Contains,
        value: 'vip',
      });
    });

    it('startsWith should create startsWith condition', () => {
      const condition = startsWith('email', 'admin@');
      expect(condition).toEqual({
        field: 'email',
        operator: ConditionOperator.StartsWith,
        value: 'admin@',
      });
    });

    it('endsWith should create endsWith condition', () => {
      const condition = endsWith('email', '.com');
      expect(condition).toEqual({
        field: 'email',
        operator: ConditionOperator.EndsWith,
        value: '.com',
      });
    });

    it('matches should create matches condition', () => {
      const pattern = /^[\w.-]+@example\.com$/;
      const condition = matches('email', pattern);
      expect(condition).toEqual({
        field: 'email',
        operator: ConditionOperator.Matches,
        value: pattern,
      });
    });
  });

  describe('array builders', () => {
    it('anyOf should create anyOf condition', () => {
      const condition = anyOf('status', ['active', 'pending']);
      expect(condition).toEqual({
        field: 'status',
        operator: ConditionOperator.AnyOf,
        value: ['active', 'pending'],
      });
    });

    it('minLength should create minLength condition', () => {
      const condition = minLength('password', 8);
      expect(condition).toEqual({
        field: 'password',
        operator: ConditionOperator.MinLength,
        value: 8,
      });
    });

    it('maxLength should create maxLength condition', () => {
      const condition = maxLength('username', 20);
      expect(condition).toEqual({
        field: 'username',
        operator: ConditionOperator.MaxLength,
        value: 20,
      });
    });
  });

  describe('null/truthy builders', () => {
    it('truthy should create truthy condition', () => {
      const condition = truthy('isActive');
      expect(condition).toEqual({
        field: 'isActive',
        operator: ConditionOperator.Truthy,
        value: true,
      });
    });

    it('isNull should create isNull condition', () => {
      const condition = isNull('deletedAt');
      expect(condition).toEqual({
        field: 'deletedAt',
        operator: ConditionOperator.IsNull,
        value: null,
      });
    });

    it('isNotNull should create isNotNull condition', () => {
      const condition = isNotNull('email');
      expect(condition).toEqual({
        field: 'email',
        operator: ConditionOperator.IsNotNull,
        value: null,
      });
    });
  });

  describe('type builders', () => {
    it('isRecord should create isRecord condition', () => {
      const condition = isRecord('metadata');
      expect(condition).toEqual({
        field: 'metadata',
        operator: ConditionOperator.IsRecord,
        value: true,
      });
    });
  });

  describe('logical builders', () => {
    it('matchesAll should create AND condition from record', () => {
      const condition = matchesAll({ name: 'John', age: 30 });
      expect(condition).toEqual({
        and: [
          { field: 'name', operator: ConditionOperator.Equal, value: 'John' },
          { field: 'age', operator: ConditionOperator.Equal, value: 30 },
        ],
      });
    });

    it('and should combine conditions', () => {
      const condition = and(eq('status', 'active'), gt('age', 18));
      expect(condition).toEqual({
        and: [
          { field: 'status', operator: ConditionOperator.Equal, value: 'active' },
          { field: 'age', operator: ConditionOperator.GreaterThan, value: 18 },
        ],
      });
    });

    it('and should filter out null/undefined conditions', () => {
      const condition = and(eq('status', 'active'), null, undefined, gt('age', 18));
      expect(condition.and).toHaveLength(2);
    });

    it('or should create OR condition', () => {
      const condition = or(eq('status', 'active'), eq('status', 'pending'));
      expect(condition).toEqual({
        or: [
          { field: 'status', operator: ConditionOperator.Equal, value: 'active' },
          { field: 'status', operator: ConditionOperator.Equal, value: 'pending' },
        ],
      });
    });
  });
});


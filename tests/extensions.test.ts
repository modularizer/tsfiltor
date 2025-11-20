import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { enableArrayExtensions, disableArrayExtensions } from '../src/extensions';
import { eq, gt, and, contains } from '../src/builders';
import '../src/extensions.d';

describe('extensions', () => {
  const users = [
    { id: 1, name: 'John', age: 25, status: 'active', tags: ['vip'] },
    { id: 2, name: 'Jane', age: 30, status: 'active', tags: ['premium'] },
    { id: 3, name: 'Bob', age: 18, status: 'inactive', tags: [] },
  ];

  beforeEach(() => {
    // Ensure extensions are enabled before each test
    enableArrayExtensions();
  });

  afterEach(() => {
    // Clean up after each test
    disableArrayExtensions();
  });

  describe('enableArrayExtensions', () => {
    it('should add .where() method to arrays', () => {
      const result = users.where(eq('status', 'active'));
      expect(result).toHaveLength(2);
      expect(result.map(u => u.name)).toEqual(['John', 'Jane']);
    });

    it('should add .first() method to arrays', () => {
      const result = users.first(eq('name', 'John'));
      expect(result).not.toBeNull();
      expect(result?.name).toBe('John');
    });

    it('should add .exists() method to arrays', () => {
      expect(users.exists(eq('status', 'active'))).toBe(true);
      expect(users.exists(eq('status', 'nonexistent'))).toBe(false);
    });

    it('should add .count() method to arrays', () => {
      expect(users.count(eq('status', 'active'))).toBe(2);
      expect(users.count(gt('age', 20))).toBe(2);
    });

    it('should add .findWhere() method to arrays', () => {
      const result = users.findWhere({ filter: eq('status', 'active'), limit: 1 });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('John');
    });

    it('should work with complex conditions', () => {
      const result = users.where(and(eq('status', 'active'), gt('age', 20)));
      expect(result).toHaveLength(2);
    });

    it('should chain with native array methods', () => {
      const result = users
        .where(eq('status', 'active'))
        .map(u => u.name.toUpperCase())
        .sort();
      expect(result).toEqual(['JANE', 'JOHN']);
    });
  });

  describe('disableArrayExtensions', () => {
    it('should remove extension methods', () => {
      enableArrayExtensions();
      expect(users.where).toBeDefined();

      disableArrayExtensions();
      expect((users as any).where).toBeUndefined();
    });
  });

  describe('overwrite option', () => {
    it('should not overwrite existing methods by default', () => {
      // Add a custom .where method
      (Array.prototype as any).where = function() {
        return 'custom';
      };

      enableArrayExtensions({ overwrite: false });
      expect(users.where()).toBe('custom');

      disableArrayExtensions();
    });

    it('should overwrite existing methods when overwrite is true', () => {
      // Add a custom .where method
      (Array.prototype as any).where = function() {
        return 'custom';
      };

      enableArrayExtensions({ overwrite: true });
      const result = users.where(eq('status', 'active'));
      expect(result).not.toBe('custom');
      expect(Array.isArray(result)).toBe(true);

      disableArrayExtensions();
    });
  });
});


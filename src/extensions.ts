/**
 * Array prototype extensions
 * Optional extensions to add filter methods directly to Array.prototype
 * Use enableArrayExtensions() to activate
 * 
 * To get TypeScript types, import the types:
 * import 'tsfiltor/extensions';
 */

import { Filter } from './types';
import { filterEntities, findFirst, matchExists, countWhere, findWhere } from './evaluator';

// Import types to activate them when this module is imported
/// <reference path="./extensions.d.ts" />

/**
 * Enable Array prototype extensions
 * Adds .where(), .first(), .exists(), .count(), and .findWhere() methods to all arrays
 * 
 * @param options Configuration options
 * @param options.overwrite If true, will overwrite existing methods (default: false)
 * 
 * @example
 * import { enableArrayExtensions } from 'tsfiltor';
 * import { eq, gt } from 'tsfiltor';
 * 
 * enableArrayExtensions();
 * 
 * const users = [{ name: 'John', age: 25 }, { name: 'Jane', age: 30 }];
 * const adults = users.where(gt('age', 18));
 * const john = users.first(eq('name', 'John'));
 */
export function enableArrayExtensions(options: { overwrite?: boolean } = {}): void {
  const { overwrite = false } = options;

  // .where() - filter entities
  if (!(Array.prototype as any).where || overwrite) {
    (Array.prototype as any).where = function<T extends Record<string, any>>(
      this: T[],
      filter?: Filter
    ): T[] {
      return filterEntities(this, filter);
    };
  }

  // .first() - find first matching entity
  if (!(Array.prototype as any).first || overwrite) {
    (Array.prototype as any).first = function<T extends Record<string, any>>(
      this: T[],
      filter?: Filter
    ): T | null {
      return findFirst(this, filter);
    };
  }

  // .exists() - check if any entity matches
  if (!(Array.prototype as any).exists || overwrite) {
    (Array.prototype as any).exists = function<T extends Record<string, any>>(
      this: T[],
      filter?: Filter
    ): boolean {
      return matchExists(this, filter);
    };
  }

  // .count() - count matching entities
  if (!(Array.prototype as any).count || overwrite) {
    (Array.prototype as any).count = function<T extends Record<string, any>>(
      this: T[],
      filter?: Filter
    ): number {
      return countWhere(this, filter);
    };
  }

  // .findWhere() - find with pagination
  if (!(Array.prototype as any).findWhere || overwrite) {
    (Array.prototype as any).findWhere = function<T extends Record<string, any>>(
      this: T[],
      options?: { filter?: Filter; limit?: number; offset?: number }
    ): T[] {
      return findWhere(this, options);
    };
  }
}

/**
 * Disable Array prototype extensions
 * Removes the methods added by enableArrayExtensions()
 */
export function disableArrayExtensions(): void {
  delete (Array.prototype as any).where;
  delete (Array.prototype as any).first;
  delete (Array.prototype as any).exists;
  delete (Array.prototype as any).count;
  delete (Array.prototype as any).findWhere;
}


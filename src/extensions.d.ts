/**
 * TypeScript type definitions for Array prototype extensions
 * Import this module to activate the types for Array extensions
 * 
 * @example
 * import 'tsfiltor/extensions';
 * import { enableArrayExtensions } from 'tsfiltor';
 * 
 * enableArrayExtensions();
 * const users = [{ name: 'John', age: 25 }];
 * users.where(...); // TypeScript now recognizes .where()
 */

import { Filter } from './types';

declare global {
  interface Array<T extends Record<string, any>> {
    /**
     * Filter array elements using a filter condition
     * @param filter Optional filter condition
     * @returns Filtered array
     * 
     * @example
     * const users = [{ name: 'John', age: 25 }, { name: 'Jane', age: 30 }];
     * const adults = users.where(gt('age', 18));
     */
    where(filter?: Filter): T[];

    /**
     * Find the first element matching the filter condition
     * @param filter Optional filter condition
     * @returns First matching element or null
     * 
     * @example
     * const user = users.first(eq('name', 'John'));
     */
    first(filter?: Filter): T | null;

    /**
     * Check if any element matches the filter condition
     * @param filter Optional filter condition
     * @returns True if at least one element matches
     * 
     * @example
     * if (users.exists(eq('status', 'active'))) {
     *   // ...
     * }
     */
    exists(filter?: Filter): boolean;

    /**
     * Count elements matching the filter condition
     * @param filter Optional filter condition
     * @returns Number of matching elements
     * 
     * @example
     * const activeCount = users.count(eq('status', 'active'));
     */
    count(filter?: Filter): number;

    /**
     * Find elements with pagination support
     * @param options Filter, limit, and offset options
     * @returns Filtered and paginated array
     * 
     * @example
     * const page1 = users.findWhere({ filter: eq('status', 'active'), limit: 10, offset: 0 });
     */
    findWhere(options?: { filter?: Filter; limit?: number; offset?: number }): T[];
  }
}

// Export empty object to make this a module (required for declare global to work)
export {};


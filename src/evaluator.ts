/**
 * Filter condition evaluator
 * Evaluates filter conditions against entities
 */

import { FilterCondition, ConditionOperator, Filter } from './types';
import { matchesAll } from './builders';
import * as conditions from './conditions';

/**
 * Type for evaluator functions
 * Takes field value, condition value, entity, and condition for evaluation
 */
type EvaluatorFn = (fieldValue: any, conditionValue: any, entity: Record<string, any>, condition: FilterCondition) => boolean;

/**
 * Registry of operator evaluators
 * Maps operator strings to their evaluation functions
 */
export const operatorEvaluators: Record<string, EvaluatorFn> = {
    [ConditionOperator.Equal]: (fieldValue, conditionValue) => conditions.eq(fieldValue, conditionValue),
    [ConditionOperator.NotEqual]: (fieldValue, conditionValue) => conditions.ne(fieldValue, conditionValue),
    [ConditionOperator.LessThan]: (fieldValue, conditionValue) => conditions.lt(fieldValue, conditionValue),
    [ConditionOperator.LessThanOrEqual]: (fieldValue, conditionValue) => conditions.lte(fieldValue, conditionValue),
    [ConditionOperator.GreaterThan]: (fieldValue, conditionValue) => conditions.gt(fieldValue, conditionValue),
    [ConditionOperator.GreaterThanOrEqual]: (fieldValue, conditionValue) => conditions.gte(fieldValue, conditionValue),
    [ConditionOperator.AnyOf]: (fieldValue, conditionValue) => conditions.anyOf(fieldValue, conditionValue),
    [ConditionOperator.Contains]: (fieldValue, conditionValue) => conditions.contains(fieldValue, conditionValue),
    [ConditionOperator.StartsWith]: (fieldValue, conditionValue) => conditions.startsWith(fieldValue, conditionValue),
    [ConditionOperator.EndsWith]: (fieldValue, conditionValue) => conditions.endsWith(fieldValue, conditionValue),
    [ConditionOperator.MinLength]: (fieldValue, conditionValue) => conditions.minLength(fieldValue, conditionValue),
    [ConditionOperator.MaxLength]: (fieldValue, conditionValue) => conditions.maxLength(fieldValue, conditionValue),
    [ConditionOperator.Truthy]: (fieldValue) => conditions.truthy(fieldValue),
    [ConditionOperator.IsNull]: (fieldValue) => conditions.isNull(fieldValue),
    [ConditionOperator.IsNotNull]: (fieldValue) => conditions.isNotNull(fieldValue),
    [ConditionOperator.Matches]: (fieldValue, conditionValue) => conditions.matches(fieldValue, conditionValue),
    [ConditionOperator.IsRecord]: (fieldValue) => conditions.isRecord(fieldValue),
    [ConditionOperator.MatchesZodSchema]: (fieldValue, conditionValue) => conditions.matchesZodSchema(fieldValue, conditionValue),
};

/**
 * Register a new operator evaluator
 * Allows extending the filter system with custom operators
 * 
 * @param operator The operator string identifier
 * @param evaluator The evaluation function that takes (fieldValue, conditionValue, entity, condition) and returns boolean
 * 
 * @example
 * registerOperator('customOp', (fieldValue, conditionValue) => {
 *   return fieldValue.customCheck(conditionValue);
 * });
 */
export function registerOperator(operator: string, evaluator: EvaluatorFn): void {
    operatorEvaluators[operator] = evaluator;
}

/**
 * Evaluate a filter condition (recursive for and/or/not/list)
 * Can accept a single condition or an array of conditions
 * Arrays are treated as AND logic (all conditions must match)
 * Plain Record objects are converted to matchesAll filters
 */
export function evaluateCondition<T extends Record<string, any>>(
    entity: T,
    condition: Filter
): boolean {
    if (condition === null || condition === undefined) return true;
    if (condition === true) return true;
    if (condition === false) return true;
    if (Array.isArray(condition)) return condition.every(c => evaluateCondition(entity, c));
    if (isPlainRecord(condition)) {
        condition = matchesAll(condition);
    }

    // Handle { and: [...] } format
    if ('and' in condition && Array.isArray(condition.and)) {
        return condition.and.every((c: FilterCondition) => evaluateCondition(entity, c));
    }

    // Handle { or: [...] } format
    if ('or' in condition && Array.isArray(condition.or)) {
        return condition.or.some((c: FilterCondition) => evaluateCondition(entity, c));
    }

    // Handle logical operators that need recursive evaluation
    if (condition.operator === ConditionOperator.AND) {
        return condition.value.every((c: FilterCondition) => evaluateCondition(entity, c));
    }

    if (condition.operator === ConditionOperator.OR) {
        return condition.value.some((c: FilterCondition) => evaluateCondition(entity, c));
    }

    if (condition.operator === ConditionOperator.NOT) {
        return !evaluateCondition(entity, condition.value);
    }

    // Look up evaluator from registry
    const evaluator = operatorEvaluators[condition.operator];
    if (!evaluator) {
        return false;
    }

    const fieldValue = entity[condition.field];
    return evaluator(fieldValue, condition.value, entity, condition);
}


export function getEvaluator(condition: Filter){
    function evaluate<T extends Record<string, any>>(entity: T){
        return evaluateCondition(entity, condition);
    }
    return evaluate;
}




/**
 * Check if a value is a plain Record (object) that should be converted to matchesAll
 */
function isPlainRecord(value: any): value is Record<string, any> {
    if (!value || typeof value !== 'object') {
        return false;
    }

    // Exclude arrays
    if (Array.isArray(value)) {
        return false;
    }

    // Exclude special objects like Date, RegExp, etc.
    if (value instanceof Date || value instanceof RegExp) {
        return false;
    }

    // Exclude objects with filter condition keys (field/operator, and, or)
    if ('field' in value && 'operator' in value) {
        return false;
    }
    if ('and' in value || 'or' in value) {
        return false;
    }

    // It's a plain object/Record
    return true;
}




/**
 * Filter an array of entities using a filter condition
 * Convenience function that applies evaluateFilter to each entity
 *
 * @param entities Array of entities to filter
 * @param filter Filter condition to apply
 * @returns Filtered array of entities
 *
 * @example
 * const filtered = filterEntities(users, { name: 'John', age: 30 });
 * const filtered = filterEntities(rounds, eq('courseId', 'abc123'));
 * const filtered = filterEntities(scores, [eq('roundId', 'round123'), gt('throws', 2)]);
 */
export function filterEntities<T extends Record<string, any>>(
    entities: T[],
    filter?: Filter
): T[] {
    return entities.filter(getEvaluator(filter));
}

/**
 * Find the first entity matching a filter condition
 * Convenience function that returns the first matching entity or null
 *
 * @param entities Array of entities to search
 * @param filter Filter condition to apply
 * @returns First matching entity or null if none found
 *
 * @example
 * const user = findFirst(users, { name: 'John', age: 30 });
 * const round = findFirst(rounds, eq('courseId', 'abc123'));
 * const score = findFirst(scores, [eq('roundId', 'round123'), gt('throws', 2)]);
 */
export function findFirst<T extends Record<string, any>>(
    entities: T[],
    filter?: Filter
): T | null {
    return entities.find(getEvaluator(filter)) || null;
}


export function matchExists<T extends Record<string, any>>(
    entities: T[],
    filter?: Filter
): boolean {
    if (!filter) {
        return entities.length > 0;
    }
    return entities.some(getEvaluator(filter));
}

export function countWhere<T extends Record<string, any>>(
    entities: T[],
    filter?: Filter
): number {
    return entities.filter(getEvaluator(filter)).length;
}

/**
 * Find entities matching a filter condition with pagination support
 * Convenience function that applies filter, offset, and limit
 * Optimized to stop filtering once enough results are found (when limit is set)
 *
 * @param entities Array of entities to search
 * @param filter Filter condition to apply
 * @param limit Maximum number of results to return (optional)
 * @param offset Number of results to skip before returning (optional)
 * @returns Filtered and paginated array of entities
 *
 * @example
 * // Get first 10 users named John
 * const users = findWhere(allUsers, { name: 'John' }, 10, 0);
 *
 * // Get next 10 users (pagination)
 * const moreUsers = findWhere(allUsers, { name: 'John' }, 10, 10);
 *
 * // Get all rounds for a course with limit
 * const rounds = findWhere(allRounds, eq('courseId', 'abc123'), 20);
 */
export function findWhere<T extends Record<string, any>>(
    entities: T[],
    {filter, limit, offset}: {filter?: Filter, limit?: number, offset?: number} = {}
): T[] {
    // If no filter, just handle pagination
    if (!filter) {
        const start = offset ?? 0;
        const end = limit !== undefined ? start + limit : undefined;
        return entities.slice(start, end);
    }

    // If limit is set, we can optimize by stopping early
    const hasLimit = limit !== undefined && limit > 0;
    const skipCount = offset ?? 0;

    const results: T[] = [];
    let skipped = 0;

    for (const entity of entities) {
        if (evaluateCondition(entity, filter)) {
            // Skip entities until we reach the offset
            if (skipped < skipCount) {
                skipped++;
                continue;
            }

            // Add to results
            results.push(entity);

            // Stop early if we've collected enough results
            if (hasLimit && results.length >= limit) {
                break;
            }
        }
    }

    return results;
}

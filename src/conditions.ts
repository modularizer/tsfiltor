
/**
 * Direct evaluation functions for filter conditions
 * These functions evaluate values directly and return boolean results
 */

export function eq(x: any, value: any): boolean {
    return x === value;
}

export function ne(x: any, value: any): boolean {
    return x !== value;
}

export function lt(x: any, value: number | string | Date): boolean {
    return x < value;
}

export function lte(x: any, value: number | string | Date): boolean {
    return x <= value;
}

export function gt(x: any, value: number | string | Date): boolean {
    return x > value;
}

export function gte(x: any, value: number | string | Date): boolean {
    return x >= value;
}

export function anyOf(x: any, values: any[]): boolean {
    if (!Array.isArray(values)) {
        return false;
    }
    return values.includes(x);
}

export function contains(x: any, value: string | any): boolean {
    if (typeof x === 'string') {
        return x.includes(String(value));
    }
    if (Array.isArray(x)) {
        return x.includes(value);
    }
    return false;
}

export function startsWith(x: any, value: string): boolean {
    if (typeof x === 'string') {
        return x.startsWith(String(value));
    }
    return false;
}

export function endsWith(x: any, value: string): boolean {
    if (typeof x === 'string') {
        return x.endsWith(String(value));
    }
    return false;
}

export function minLength(x: any, value: number): boolean {
    if (typeof x === 'string' || Array.isArray(x)) {
        return x.length >= value;
    }
    return false;
}

export function maxLength(x: any, value: number): boolean {
    if (typeof x === 'string' || Array.isArray(x)) {
        return x.length <= value;
    }
    return false;
}

export function truthy(x: any): boolean {
    return !!x;
}

export function isNull(x: any): boolean {
    return x === null || x === undefined;
}

export function isNotNull(x: any): boolean {
    return x !== null && x !== undefined;
}

function resolvePattern(value: unknown): RegExp | null {
    if (value instanceof RegExp) {
        return value;
    }
    if (typeof value === 'string') {
        try {
            return new RegExp(value);
        } catch {
            return null;
        }
    }
    return null;
}

export function matches(x: any, pattern: RegExp | string): boolean {
    const resolvedPattern = resolvePattern(pattern);
    if (!resolvedPattern || typeof x !== 'string') {
        return false;
    }
    return resolvedPattern.test(x);
}



export function isRecord(value: unknown): value is Record<string, unknown> {
    if (typeof value !== 'object' || value === null) return false;

    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}

export function matchesZodSchema(value: unknown, schema: any): boolean {
    return schema.safeParse(value).success;
}

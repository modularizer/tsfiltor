# tsfiltor

A composable TypeScript filter system for querying and evaluating in-memory data. Provides a structured way to build complex query conditions that can be evaluated against entities.

**Try it live:** Go to https://modularizer.github.io/tsfiltor 

## Features

- 🎯 **Composable filters** - Build complex conditions with simple builder functions
- 🔍 **Rich operators** - Equality, comparison, string matching, regex, type checking, and more
- 🧩 **Logical operations** - AND, OR, NOT with nested conditions
- 🚀 **Array extensions** - Optional prototype extensions for fluent API
- 🔧 **Extensible** - Register custom operators easily
- 📦 **Type-safe** - Full TypeScript support

## Installation

```bash
npm install tsfiltor
```

### Universal Compatibility

This package is built with **dual module support** (ESM + CommonJS) for maximum compatibility:

- ✅ **Node.js** (ESM and CommonJS) - Node 18+
- ✅ **Browsers** (ESM via CDN or bundlers)
- ✅ **React Native** (CommonJS) - Full support
- ✅ **Bundlers** (Webpack, Vite, Rollup, etc.) - Auto-detects format
- ✅ **TypeScript** (full type support)

The package automatically serves the correct format:
- `import { ... } from 'tsfiltor'` → ESM (browsers, modern Node.js, bundlers)
- `const { ... } = require('tsfiltor')` → CommonJS (React Native, older tools)

### Browser Usage

The package works in browsers via CDN. Use [esm.sh](https://esm.sh) or similar CDN:

```html
<script type="module">
  import { eq, gt, filterEntities } from 'https://esm.sh/tsfiltor@latest';
  // Use the library...
</script>
```

**Try it live:** Go to https://modularizer.github.io/tsfiltor for an interactive playground with editable examples!

## Basic Usage

```typescript
import { eq, gt, and, or, filterEntities, evaluateCondition } from 'tsfiltor';

const users = [
  { name: 'John', age: 25, status: 'active' },
  { name: 'Jane', age: 30, status: 'active' },
  { name: 'Bob', age: 18, status: 'inactive' },
];

// Build and evaluate conditions
const condition = and(
  eq('status', 'active'),
  gt('age', 20)
);

const activeAdults = filterEntities(users, condition);
// Returns: [{ name: 'John', age: 25, status: 'active' }, ...]
```

## Array Extensions (Optional)

For a more fluent API, you can enable Array prototype extensions. **The types are only available when you explicitly import the extensions module:**

```typescript
// Import types and functions - this activates TypeScript support for Array extensions
import 'tsfiltor/extensions';
import { enableArrayExtensions } from 'tsfiltor/extensions';
import { eq, gt, contains } from 'tsfiltor';

// Enable extensions (opt-in)
enableArrayExtensions();

const users = [
    { id: 1, name: 'John Doe', age: 30, email: 'john@example.com', status: 'active', tags: ['vip', 'premium'] },
    { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com', status: 'active', tags: ['premium'] },
    { id: 3, name: 'Bob Johnson', age: 18, email: 'bob@test.com', status: 'inactive', tags: [] },
    { id: 4, name: 'Alice Brown', age: 35, email: 'alice@example.com', status: 'pending', tags: ['vip'] },
];

// Now arrays have .where(), .first(), .exists(), .count(), and .findWhere()
const activeUsers = users.where(eq('status', 'active'));
const john = users.first(eq('name', 'John'));
const hasVip = users.exists(contains('tags', 'vip'));
const count = users.count(gt('age', 25));

// Chain with native array methods
const names = users
  .where(gt('age', 20))
  .map(u => u.name)
  .sort();
```

**Note:** 
- Extensions are opt-in. If you prefer the functional approach, you can use `filterEntities()`, `findFirst()`, etc. without enabling extensions.
- **You must import `'tsfiltor/extensions'` to get TypeScript type support** - the types are NOT included in the main package export.
- Importing `'tsfiltor/extensions'` activates the `declare global` block, making the Array extension methods available to TypeScript.

## Available Operators

### Comparison
- `eq(field, value)` - Equality
- `ne(field, value)` - Not equal
- `lt(field, value)` - Less than
- `lte(field, value)` - Less than or equal
- `gt(field, value)` - Greater than
- `gte(field, value)` - Greater than or equal

### String Operations
- `contains(field, value)` - String/array contains
- `startsWith(field, value)` - String starts with
- `endsWith(field, value)` - String ends with
- `matches(field, pattern)` - Regex pattern match

### Array Operations
- `anyOf(field, values[])` - Value is in array
- `minLength(field, n)` - Minimum length
- `maxLength(field, n)` - Maximum length

### Type Checking
- `isRecord(field)` - Is plain object/Record
- `matchesZodSchema(field, schema)` - Matches Zod schema

### Logical
- `and(...conditions)` - All conditions must match
- `or(...conditions)` - Any condition must match
- `not(condition)` - Negate condition

## Examples

See the [examples](./examples/) directory for more detailed examples:
- [Basic Usage](./examples/basic-usage.ts)
- [Advanced Usage](./examples/advanced-usage.ts)
- [Array Extensions](./examples/array-extensions.ts)

## Custom Operators

Register custom operators for specialized logic:

```typescript
import { registerOperator, ConditionOperator } from 'tsfiltor';

registerOperator('priceRange', (fieldValue, conditionValue) => {
  const [min, max] = conditionValue;
  return fieldValue >= min && fieldValue <= max;
});

// Use the custom operator
const condition = {
  field: 'price',
  operator: 'priceRange' as ConditionOperator,
  value: [100, 500],
};
```

## API Reference

### Core Functions

- `evaluateCondition(entity, condition)` - Evaluate condition against entity
- `filterEntities(entities, filter?)` - Filter array of entities
- `findFirst(entities, filter?)` - Find first matching entity
- `matchExists(entities, filter?)` - Check if any entity matches
- `countWhere(entities, filter?)` - Count matching entities
- `findWhere(entities, options?)` - Find with pagination support

### Extension Functions

- `enableArrayExtensions(options?)` - Enable Array prototype extensions
- `disableArrayExtensions()` - Disable Array prototype extensions
- `registerOperator(operator, evaluator)` - Register custom operator

## License

Unlicense - This is free and unencumbered software released into the public domain.

For more information, see [LICENSE](./LICENSE) or <https://unlicense.org>

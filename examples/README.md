# Examples

This directory contains example code demonstrating how to use tsfiltor.

## Running Examples

To run the examples, you'll need to compile TypeScript first:

```bash
npm run build
```

Then run the examples using Node:

```bash
# Basic usage examples
node dist/examples/basic-usage.js

# Advanced usage examples
node dist/examples/advanced-usage.js
```

Or use ts-node if you have it installed:

```bash
npx ts-node examples/basic-usage.ts
npx ts-node examples/advanced-usage.ts
```

## Example Files

### basic-usage.ts

Demonstrates fundamental filter operations:
- Simple equality checks
- Comparison operators (gt, lt, etc.)
- String operations (contains, startsWith, matches)
- Logical operators (AND, OR)
- Complex nested conditions
- Finding and filtering entities

### advanced-usage.ts

Demonstrates advanced features:
- Type checking with isRecord
- Custom operator registration
- Complex multi-condition filtering
- Nested field access with custom operators
- Combining multiple filter strategies

## Key Concepts

### Building Conditions

Use builder functions to create filter conditions:

```typescript
import { eq, gt, and, or } from 'tsfiltor';

const condition = and(
  eq('status', 'active'),
  gt('age', 18)
);
```

### Evaluating Conditions

Evaluate conditions against entities:

```typescript
import { evaluateCondition } from 'tsfiltor';

const user = { name: 'John', age: 25, status: 'active' };
const matches = evaluateCondition(user, condition);
```

### Filtering Arrays

Filter arrays of entities:

```typescript
import { filterEntities } from 'tsfiltor';

const users = [/* ... */];
const activeUsers = filterEntities(users, eq('status', 'active'));
```

### Custom Operators

Register custom operators for specialized logic:

```typescript
import { registerOperator } from 'tsfiltor';

registerOperator('priceRange', (fieldValue, conditionValue) => {
  const [min, max] = conditionValue;
  return fieldValue >= min && fieldValue <= max;
});
```


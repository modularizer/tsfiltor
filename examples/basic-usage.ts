/**
 * Basic Usage Examples
 * Demonstrates fundamental filter operations
 */

import {
  eq,
  ne,
  gt,
  lt,
  gte,
  lte,
  contains,
  startsWith,
  endsWith,
  matches,
  and,
  or,
  evaluateCondition,
  filterEntities,
  findFirst,
} from '../src';

// Sample data
const users = [
  { id: 1, name: 'John Doe', age: 30, email: 'john@example.com', status: 'active', tags: ['vip', 'premium'] },
  { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com', status: 'active', tags: ['premium'] },
  { id: 3, name: 'Bob Johnson', age: 18, email: 'bob@test.com', status: 'inactive', tags: [] },
  { id: 4, name: 'Alice Brown', age: 35, email: 'alice@example.com', status: 'pending', tags: ['vip'] },
];

console.log('=== Basic Usage Examples ===\n');

// Example 1: Simple equality check
console.log('1. Simple Equality:');
const user1 = users[0];
const isJohn = evaluateCondition(user1, eq('name', 'John Doe'));
console.log(`   Is user John Doe? ${isJohn}`); // true

// Example 2: Comparison operators
console.log('\n2. Comparison Operators:');
const adults = filterEntities(users, gt('age', 18));
console.log(`   Adults (age > 18): ${adults.length} users`);
adults.forEach(u => console.log(`   - ${u.name} (age ${u.age})`));

// Example 3: String operations
console.log('\n3. String Operations:');
const exampleEmails = filterEntities(users, contains('email', 'example'));
console.log(`   Users with @example.com: ${exampleEmails.length}`);
exampleEmails.forEach(u => console.log(`   - ${u.email}`));

// Example 4: Regex matching
console.log('\n4. Regex Matching:');
const validEmails = filterEntities(users, matches('email', /^[\w.-]+@example\.com$/));
console.log(`   Valid example.com emails: ${validEmails.length}`);

// Example 5: AND conditions
console.log('\n5. AND Conditions:');
const activeAdults = filterEntities(
  users,
  and(
    eq('status', 'active'),
    gt('age', 20)
  )
);
console.log(`   Active adults: ${activeAdults.length}`);
activeAdults.forEach(u => console.log(`   - ${u.name} (${u.status}, age ${u.age})`));

// Example 6: OR conditions
console.log('\n6. OR Conditions:');
const activeOrPending = filterEntities(
  users,
  or(
    eq('status', 'active'),
    eq('status', 'pending')
  )
);
console.log(`   Active or pending: ${activeOrPending.length}`);

// Example 7: Complex nested conditions
console.log('\n7. Complex Nested Conditions:');
const complexFilter = and(
  or(
    eq('status', 'active'),
    eq('status', 'pending')
  ),
  gt('age', 20),
  contains('email', 'example')
);
const complexResults = filterEntities(users, complexFilter);
console.log(`   Complex filter results: ${complexResults.length}`);

// Example 8: Find first match
console.log('\n8. Find First Match:');
const firstVip = findFirst(users, contains('tags', 'vip'));
if (firstVip) {
  console.log(`   First VIP user: ${firstVip.name}`);
}

// Example 9: Plain object filter (matchesAll)
console.log('\n9. Plain Object Filter:');
const exactMatch = filterEntities(users, { name: 'John Doe', status: 'active' });
console.log(`   Exact match: ${exactMatch.length} user(s)`);

// Example 10: Array filter (AND logic)
console.log('\n10. Array Filter (AND logic):');
const arrayFilter = [
  eq('status', 'active'),
  gt('age', 25)
];
const arrayResults = filterEntities(users, arrayFilter);
console.log(`   Array filter results: ${arrayResults.length}`);

console.log('\n=== Examples Complete ===');


/**
 * Array Extensions Example
 * Demonstrates optional Array.prototype extensions
 */

import {
  enableArrayExtensions,
  disableArrayExtensions,
  eq,
  gt,
  contains,
  and,
  or,
} from '../src';

// Sample data
const users = [
  { id: 1, name: 'John', age: 25, email: 'john@example.com', status: 'active', tags: ['vip'] },
  { id: 2, name: 'Jane', age: 30, email: 'jane@example.com', status: 'active', tags: ['premium'] },
  { id: 3, name: 'Bob', age: 18, email: 'bob@test.com', status: 'inactive', tags: [] },
  { id: 4, name: 'Alice', age: 35, email: 'alice@example.com', status: 'pending', tags: ['vip'] },
];

console.log('=== Array Extensions Example ===\n');

// Enable extensions (opt-in)
console.log('1. Enabling Array extensions...');
enableArrayExtensions();
console.log('   ✓ Extensions enabled\n');

// Now arrays have .where(), .first(), .exists(), .count(), and .findWhere()

// Example 1: Using .where()
console.log('2. Using .where() method:');
const activeUsers = users.where(eq('status', 'active'));
console.log(`   Active users: ${activeUsers.length}`);
activeUsers.forEach(u => console.log(`   - ${u.name} (${u.status})`));

// Example 2: Using .first()
console.log('\n3. Using .first() method:');
const john = users.first(eq('name', 'John'));
if (john) {
  console.log(`   Found: ${john.name} (age ${john.age})`);
}

// Example 3: Using .exists()
console.log('\n4. Using .exists() method:');
const hasVip = users.exists(contains('tags', 'vip'));
console.log(`   Has VIP users: ${hasVip}`);

// Example 4: Using .count()
console.log('\n5. Using .count() method:');
const activeCount = users.count(eq('status', 'active'));
const adultCount = users.count(gt('age', 18));
console.log(`   Active users: ${activeCount}`);
console.log(`   Adults: ${adultCount}`);

// Example 5: Using .findWhere() with pagination
console.log('\n6. Using .findWhere() with pagination:');
const page1 = users.findWhere({ filter: eq('status', 'active'), limit: 1, offset: 0 });
const page2 = users.findWhere({ filter: eq('status', 'active'), limit: 1, offset: 1 });
console.log(`   Page 1: ${page1.map(u => u.name).join(', ')}`);
console.log(`   Page 2: ${page2.map(u => u.name).join(', ')}`);

// Example 6: Chaining with native array methods
console.log('\n7. Chaining with native array methods:');
const result = users
  .where(and(eq('status', 'active'), gt('age', 20)))
  .map(u => u.name.toUpperCase())
  .sort();
console.log(`   Result: ${result.join(', ')}`);

// Example 7: Complex filtering
console.log('\n8. Complex filtering:');
const complexResult = users.where(
  or(
    and(eq('status', 'active'), gt('age', 25)),
    contains('tags', 'vip')
  )
);
console.log(`   Complex filter matches: ${complexResult.length}`);
complexResult.forEach(u => {
  console.log(`   - ${u.name} (status: ${u.status}, age: ${u.age}, tags: ${u.tags.join(', ') || 'none'})`);
});

// Optional: Disable extensions if needed
console.log('\n9. Disabling extensions...');
disableArrayExtensions();
console.log('   ✓ Extensions disabled');
console.log('   Note: You can re-enable with enableArrayExtensions()');

console.log('\n=== Example Complete ===');


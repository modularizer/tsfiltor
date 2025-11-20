"use strict";
/**
 * Advanced Usage Examples
 * Demonstrates advanced features like custom operators and type checking
 */
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
// Sample data with nested structures
const products = [
    {
        id: 1,
        name: 'Laptop',
        price: 999.99,
        metadata: { brand: 'TechCorp', warranty: 2 },
        tags: ['electronics', 'computers'],
    },
    {
        id: 2,
        name: 'Phone',
        price: 599.99,
        metadata: { brand: 'TechCorp', warranty: 1 },
        tags: ['electronics', 'mobile'],
    },
    {
        id: 3,
        name: 'Tablet',
        price: 399.99,
        metadata: { brand: 'OtherBrand', warranty: 1 },
        tags: ['electronics'],
    },
];
console.log('=== Advanced Usage Examples ===\n');
// Example 1: Type checking with isRecord
console.log('1. Type Checking (isRecord):');
const withMetadata = (0, src_1.filterEntities)(products, (0, src_1.isRecord)('metadata'));
console.log(`   Products with metadata object: ${withMetadata.length}`);
withMetadata.forEach(p => {
    console.log(`   - ${p.name}: ${JSON.stringify(p.metadata)}`);
});
// Example 2: Custom operator registration
console.log('\n2. Custom Operator Registration:');
(0, src_1.registerOperator)('priceRange', (fieldValue, conditionValue) => {
    const [min, max] = conditionValue;
    return fieldValue >= min && fieldValue <= max;
});
// Use the custom operator
const midRangeProducts = products.filter(p => {
    const condition = {
        field: 'price',
        operator: 'priceRange',
        value: [400, 800],
    };
    return (0, src_1.evaluateCondition)(p, condition);
});
console.log(`   Products in price range $400-$800: ${midRangeProducts.length}`);
midRangeProducts.forEach(p => {
    console.log(`   - ${p.name}: $${p.price}`);
});
// Example 3: Complex filtering with multiple conditions
console.log('\n3. Complex Multi-Condition Filtering:');
const complexFilter = (0, src_1.and)((0, src_1.gt)('price', 500), (0, src_1.isRecord)('metadata'));
const expensiveWithMetadata = (0, src_1.filterEntities)(products, complexFilter);
console.log(`   Expensive products with metadata: ${expensiveWithMetadata.length}`);
expensiveWithMetadata.forEach(p => {
    console.log(`   - ${p.name}: $${p.price}, Brand: ${p.metadata.brand}`);
});
// Example 4: Combining multiple filter strategies
console.log('\n4. Combining Filter Strategies:');
const filter1 = (0, src_1.gt)('price', 400);
const filter2 = (0, src_1.isRecord)('metadata');
// Filter with first condition, then second
const step1 = (0, src_1.filterEntities)(products, filter1);
const step2 = (0, src_1.filterEntities)(step1, filter2);
console.log(`   Step 1 (price > $400): ${step1.length} products`);
console.log(`   Step 2 (with metadata): ${step2.length} products`);
// Example 5: Using OR with different field conditions
console.log('\n5. OR with Different Fields:');
const cheapOrTechCorp = (0, src_1.filterEntities)(products, (0, src_1.or)(lt('price', 500), 
// Note: We'd need a custom operator to check nested metadata.brand
// This is a simplified example
(0, src_1.eq)('id', 1) // Using ID as a proxy
));
console.log(`   Cheap or TechCorp products: ${cheapOrTechCorp.length}`);
// Example 6: Custom operator for nested field access
console.log('\n6. Custom Operator for Nested Fields:');
(0, src_1.registerOperator)('nestedEq', (fieldValue, conditionValue) => {
    const [path, expectedValue] = conditionValue;
    let current = fieldValue;
    for (const key of path) {
        if (current == null || typeof current !== 'object') {
            return false;
        }
        current = current[key];
    }
    return current === expectedValue;
});
const techCorpProducts = products.filter(p => {
    const condition = {
        field: 'metadata',
        operator: 'nestedEq',
        value: [['brand'], 'TechCorp'],
    };
    return (0, src_1.evaluateCondition)(p, condition);
});
console.log(`   TechCorp products: ${techCorpProducts.length}`);
techCorpProducts.forEach(p => {
    console.log(`   - ${p.name}: ${p.metadata.brand}`);
});
console.log('\n=== Advanced Examples Complete ===');

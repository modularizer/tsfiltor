/**
 * Filter exports
 * Central export point for filter types, evaluators, and builders
 * 
 * Note: Array extensions are NOT exported here. Import them separately:
 * import 'tsfiltor/extensions';
 * import { enableArrayExtensions } from 'tsfiltor/extensions';
 */

export * from './types';
export * from './evaluator';
export * from './builders';
// Extensions are NOT exported from main index - import 'tsfiltor/extensions' separately

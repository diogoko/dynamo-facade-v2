/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BetweenComparison,
  Comparison,
  FunctionComparison,
  InComparison,
  SimpleComparison,
  SizeComparison,
} from './expression';

/**
 * Check if an attribute is different from a value.
 *
 * @example
 * ```js
 * df.scan('movies', { genre: ne('terror') })
 * ```
 *
 * @param value The value to be compared to
 * @returns An object describing the comparison
 */
export function ne(value: any) {
  return new SimpleComparison('<>', value);
}

export function inList(value: any) {
  return new InComparison(value);
}

export function le(value: any) {
  return new SimpleComparison('<=', value);
}

export function lt(value: any) {
  return new SimpleComparison('<', value);
}

export function ge(value: any) {
  return new SimpleComparison('>=', value);
}

export function gt(value: any) {
  return new SimpleComparison('>', value);
}

export function between(value: [any, any]) {
  return new BetweenComparison(value);
}

export function contains(value: any) {
  return new FunctionComparison('contains', value);
}

export function attribute_exists() {
  return new FunctionComparison('attribute_exists');
}

export function attribute_not_exists() {
  return new FunctionComparison('attribute_not_exists');
}

export function attribute_type(type: string) {
  return new FunctionComparison('attribute_type', type);
}

export function size(value: number | Comparison) {
  return new SizeComparison(value);
}

export function begins_with(value: any) {
  return new FunctionComparison('begins_with', value);
}

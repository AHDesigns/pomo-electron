import { DeepPartial } from '@shared/types';
import _merge from 'lodash.merge';

export const merge = <A, B>(a: A, b: B): A & B => _merge({}, a, b);

export function override<A, B extends DeepPartial<A> | undefined>(a: A, b: B): A {
  return _merge({}, a, b);
}

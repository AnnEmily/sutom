import _isEqual from 'lodash/isEqual';
import _isNull from 'lodash/isNull';

import { UnselectedValue } from "../constants";


export const arrayIndexes = (length: number) => [...Array(length).keys()];

export const className = (obj: Object) => obj.constructor.name;

export const isUnselected = (value: string | null): boolean => {
  return _isNull(value) || _isEqual(value, UnselectedValue);
}

export { Verbosity } from "./trace";
export * as trace from './trace';

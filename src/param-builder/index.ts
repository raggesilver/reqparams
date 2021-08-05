// ( ^ω^)

import { BooleanBuilder } from './boolean';
import { DateBuilder } from './date';
import { NumberBuilder } from './number';
import { StringBuilder } from './string';

export default {
  Boolean: () => new BooleanBuilder(),
  Date: () => new DateBuilder(),
  Number: () => new NumberBuilder(),
  String: () => new StringBuilder(),
};

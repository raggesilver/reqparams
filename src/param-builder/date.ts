import { applyMixins } from '../utils';
import { MinMax } from './mixins/min-max';
import { LessGreater } from './mixins/less-greater';
import ParamBuilder from './default';

export interface DateBuilder extends ParamBuilder, MinMax, LessGreater<Date> {}

export class DateBuilder extends ParamBuilder {
  constructor() {
    super(Date);
  }
}

applyMixins(DateBuilder, [MinMax, LessGreater]);

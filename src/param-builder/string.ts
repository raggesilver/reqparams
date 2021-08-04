import { applyMixins } from '../utils';
import { Enum } from './mixins/enum';
import { MinMax } from './mixins/min-max';
import { NotEmpty } from './mixins/not-empty';
import ParamBuilder from './default';

export interface StringBuilder
  extends ParamBuilder,
    MinMax,
    NotEmpty,
    Enum<string> {}

export class StringBuilder extends ParamBuilder {
  constructor() {
    super(String);
  }

  matches(reg: RegExp, errorMessage?: string) {
    this.validate.push((v: string) => {
      if (!v.match(reg)) {
        return errorMessage || 'FIXME: throw error';
      }
      return true;
    });
    return this;
  }

  /** @deprecated use `matches` instead */
  match = this.matches;
}

applyMixins(StringBuilder, [MinMax, NotEmpty, Enum]);

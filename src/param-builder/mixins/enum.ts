import { ErrorType, ESpecificError, ParamError } from '../../error';
import ParamBuilder from '../default';

export class Enum<
  T extends number | string | boolean | Date,
> extends ParamBuilder {
  setEnum(values: T[], errorMessage?: string) {
    this.enum = values;
    this.validate.push((v: T, _req, param, path) => {
      if (!values.includes(v)) {
        throw new ParamError(
          param,
          path,
          ErrorType.VALIDATION_ERROR,
          errorMessage,
          ESpecificError.NOT_IN_ENUM,
          { enum: values },
        );
      }
      return true;
    });
    return this;
  }
}

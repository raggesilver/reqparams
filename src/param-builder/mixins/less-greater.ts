import ParamBuilder from '../default';
import { ErrorType, ESpecificError, ParamError } from '../../error';
import { ValidateFunction } from '../../types';

type DimensionComparisonType = 'lt' | 'leq' | 'gt' | 'geq';

const errorType = {
  lt: ESpecificError.LESS_THAN,
  leq: ESpecificError.LESS_THAN_EQUAL,
  gt: ESpecificError.GREATER_THAN,
  geq: ESpecificError.GREATER_THAN_EQUAL,
};

function dimensionComparison<T extends number | Date>(
  n: T,
  errorMessage: string | undefined,
  type: DimensionComparisonType,
): ValidateFunction {
  return (v: T, _req, param, path) => {
    const ops: { [K in DimensionComparisonType]: (a: T, b: T) => boolean } = {
      lt: (a: T, b: T) => a < b,
      leq: (a: T, b: T) => a <= b,
      gt: (a: T, b: T) => a > b,
      geq: (a: T, b: T) => a >= b,
    };

    const fulfills = ops[type](v, n);

    if (!fulfills) {
      throw new ParamError(
        param,
        path,
        ErrorType.VALIDATION_ERROR,
        errorMessage,
        errorType[type],
        { value: n },
      );
    }

    return true;
  };
}

export class LessGreater<T extends number | Date> extends ParamBuilder {
  lessThan(n: T, errorMessage?: string) {
    this.validate.push(dimensionComparison(n, errorMessage, 'lt'));
    return this;
  }

  lessThanOrEqual(n: T, errorMessage?: string) {
    this.validate.push(dimensionComparison(n, errorMessage, 'leq'));
    return this;
  }

  greaterThan(n: T, errorMessage?: string) {
    this.validate.push(dimensionComparison(n, errorMessage, 'gt'));
    return this;
  }

  greaterThanOrEqual(n: T, errorMessage?: string) {
    this.validate.push(dimensionComparison(n, errorMessage, 'geq'));
    return this;
  }

  lt(...args: Parameters<LessGreater<T>['lessThan']>) {
    return this.lessThan(...args);
  }

  leq(...args: Parameters<LessGreater<T>['lessThanOrEqual']>) {
    return this.lessThanOrEqual(...args);
  }

  gt(...args: Parameters<LessGreater<T>['greaterThan']>) {
    return this.greaterThan(...args);
  }

  geq(...args: Parameters<LessGreater<T>['greaterThanOrEqual']>) {
    return this.greaterThanOrEqual(...args);
  }
}

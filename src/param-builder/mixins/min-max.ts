import ParamBuilder from '../default';

export class MinMax extends ParamBuilder {
  min (n: number, errorMessage?: string) {
    this.validate.push((v: string | any[] | Date | number) => {
      if (this.type === String || this.type === Array) {
        if ((v as string | any[]).length < n) {
          return errorMessage || 'FIXME: throw error';
        }
      }
      else {
        if ((v as Date | number) < n) {
          return errorMessage || 'FIXME: throw error';
        }
      }
      return true;
    });
    return this;
  }

  max (n: number, errorMessage?: string) {
    this.validate.push((v: string | any[] | Date | number) => {
      if (this.type === String || this.type === Array) {
        if ((v as string | any[]).length > n) {
          return errorMessage || 'FIXME: throw error';
        }
      }
      else {
        if ((v as Date | number) > n) {
          return errorMessage || 'FIXME: throw error';
        }
      }
      return true;
    });
    return this;
  }
}

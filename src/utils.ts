export function maybePlural (text: string, amount: number) {
  return (amount === 1) ? text : `${text}s`;
}

/**
 * @param derivedCtor The class inheriting multiple classes
 * @param constructors The constructors to inherit
 */
export function applyMixins (derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null)
      );
    });
  });
}

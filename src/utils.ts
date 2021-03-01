export function maybePlural (text: string, amount: number) {
  return (amount === 1) ? text : `${text}s`;
}

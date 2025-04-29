export function hex(n: number): string {
  return Math.random().toString(16).slice(2, 2 + n);
}

export function uuid(): string {
  return crypto.randomUUID();
}

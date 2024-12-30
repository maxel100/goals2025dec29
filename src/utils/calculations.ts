export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function getCompletedCount<T>(items: T[], predicate: (item: T) => boolean): number {
  return items.filter(predicate).length;
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
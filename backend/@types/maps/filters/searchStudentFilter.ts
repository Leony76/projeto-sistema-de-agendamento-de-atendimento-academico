export const orderMap = {
  AZnames: { name: 'asc' },
  ZAnames: { name: 'desc' },
  mostRecentsRegistered: { createdAt: 'desc' },
  mostOldRegistered: { createdAt: 'asc' },
} as const;
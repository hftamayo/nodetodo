import crypto from 'crypto';

export function generateETag(data: Array<{ id: string | number; title: string; updatedAt: string }>): string {
  const etagSource = data.map(item => `${item.id}:${item.title}:${item.updatedAt}`).join('|');
  return 'W/"' + crypto.createHash('sha256').update(etagSource).digest('hex') + '"';
} 
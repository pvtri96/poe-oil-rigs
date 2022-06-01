import fs from 'fs';
import path from 'path';

export const CACHE_LOCATION = path.join(process.cwd(), 'resources', 'data', '.cache');

export function isCacheValid() {
  const metaFile = fs.readFileSync(path.join(CACHE_LOCATION, 'meta.json'), { encoding: 'utf-8' });
  const cachedAt = new Date(JSON.parse(metaFile).cachedAt);
  const now = new Date();
  return now.getTime() - cachedAt.getTime() < 4 * 3600 * 1000; // 4 hours
}

export function burstCache() {
  const files = fs.readdirSync(CACHE_LOCATION, { encoding: '' });
  files.forEach((file) => {});
}

export function updateCacheMeta() {
  const meta = { cachedAt: new Date() };
  fs.writeFileSync(path.join(CACHE_LOCATION, 'meta.json'), JSON.stringify(meta));
}

import fs from 'fs';
import path from 'path';

export const CACHE_LOCATION = path.join(process.cwd(), 'resources', 'data', '.cache');

export function isCacheValid(filePath: string, age = 3600 * 1000 /** 1 hours */) {
  if (!fs.existsSync(getMetaFilePath(filePath))) {
    return false;
  }
  const metaFile = fs.readFileSync(getMetaFilePath(filePath), { encoding: 'utf-8' });
  const cachedAt = new Date(JSON.parse(metaFile).cachedAt);
  const now = new Date();
  return now.getTime() - cachedAt.getTime() < age;
}

export function burstCache(filePath: string) {
  if (!fs.existsSync(getMetaFilePath(filePath))) {
    return;
  }
  fs.rmSync(filePath);
  fs.rmSync(getMetaFilePath(filePath));
}

export function updateCacheMeta(filePath: string) {
  const meta = { cachedAt: new Date() };
  fs.writeFileSync(getMetaFilePath(filePath), JSON.stringify(meta));
}

function getMetaFilePath(filePath: string) {
  return path.join(path.dirname(filePath), `${path.basename(filePath)}.meta.json`);
}
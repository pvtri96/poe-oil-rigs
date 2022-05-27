import * as fs from 'fs';
import * as path from 'path';

interface StashResponse {
  numTabs: number;
  tabs: unknown[];
  quadLayout: boolean;
  items: StashItem[];
}

export interface StashItem {
  verified: boolean;
  w: number;
  h: number;
  icon: string;
  league: string;
  id: string;
  name: string;
  x: number;
  y: number;
  typeLine: string;
  baseType: string;
  identified: boolean;
  ilvl: number;
  enchantMods?: string[];
}

export function getStash(specifiedPath?: string): StashResponse {
  const filePath = path.join(process.cwd(), 'resources', 'fixtures', 'stash.json');
  const fileContent = fs.readFileSync(specifiedPath ?? filePath, { encoding: 'utf-8' });
  return JSON.parse(fileContent);
}

export function getAmulets(stash: StashResponse): StashItem[] {
  return stash.items.filter((item) => item.baseType.includes('Amulet'));
}

export function getRings(stash: StashResponse): StashItem[] {
  return stash.items.filter((item) => item.baseType.includes('Ring'));
}

export function withEnchant(items: StashItem[]): StashItem[] {
  return items.filter((item) => item.enchantMods && item.enchantMods.length > 0);
}

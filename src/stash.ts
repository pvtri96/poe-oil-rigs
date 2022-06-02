import * as fs from 'fs';
import inquirer from 'inquirer';
import fetch from 'node-fetch';
import * as path from 'path';
import { getAuthentication } from './authentication';

interface StashResponse {
  numTabs: number;
  tabs: Tab[];
  quadLayout: boolean;
  items: StashItem[];
}

export interface Tab {
  id: string;
  n: string;
  i: number;
  type: string;
  colour: { r: number; g: number; b: number };
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

export function getStashFixture(specifiedPath?: string): StashResponse {
  const filePath = path.join(process.cwd(), 'resources', 'fixtures', 'stash.json');
  const fileContent = fs.readFileSync(specifiedPath ?? filePath, { encoding: 'utf-8' });
  return JSON.parse(fileContent);
}

export async function getStash(): Promise<StashResponse> {
  const auth = getAuthentication();

  let result = await fetch(
    `https://www.pathofexile.com/character-window/get-stash-items?league=${auth.league}&tabs=1&tabIndex=0&accountName=${auth.accountName}`,
    { headers: { cookie: `POESESSID=${auth.poesessid}` } },
  ).then((res) => res.json() as Promise<StashResponse>);

  const answer = await inquirer.prompt({
    type: 'list',
    name: 'tabIndex',
    choices: result.tabs.map((tab) => ({ value: tab.i, name: tab.n })),
    default: 0,
    pageSize: 10,
  });

  if (answer.tabIndex !== 0) {
    result = await fetch(
      `https://www.pathofexile.com/character-window/get-stash-items?league=${auth.league}&tabs=1&tabIndex=${answer.tabIndex}&accountName=${auth.accountName}`,
      { headers: { cookie: `POESESSID=${auth.poesessid}` } },
    ).then((res) => res.json() as Promise<StashResponse>);
  }

  return result;
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

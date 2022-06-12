import { load } from 'cheerio';
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import { burstCache, CACHE_LOCATION, isCacheValid, updateCacheMeta } from './cache-buster';

async function getContent(): Promise<string> {
  const filePath = path.join(CACHE_LOCATION, 'ring-anointments.html');

  if (!isCacheValid(filePath, 1000 * 3600 * 48 /** 2 days */)) {
    console.log('No cache found or outdated cache for ring anointments, start fetching!');
    burstCache(filePath);
    const result = await fetch('https://poedb.tw/us/Rings#AnointRings').then((res) => res.text());

    fs.writeFileSync(filePath, result);
    updateCacheMeta(filePath);
  }

  return fs.readFileSync(filePath, { encoding: 'utf-8' });
}

function parseAnointments(content: string) {
  const $ = load(content);
  const result: RingAnointment[] = [];

  const rows = $(`#AnointRings tbody tr`);

  rows.each((_, row) => {
    const oilCell = $('td:eq(1)', row);
    const oils: string[] = [$('a:eq(0)', oilCell).text().trim(), $('a:eq(1)', oilCell).text().trim()];

    const anointment: RingAnointment = {
      mod: $('td:eq(2)', row).text().trim(),
      oils,
    };
    result.push(anointment);
  });

  return result;
}

export interface RingAnointment {
  oils: string[];
  mod: string;
}

export async function getRingAnointments() {
  const content = await getContent();
  const anointments = parseAnointments(content);
  return anointments;
}

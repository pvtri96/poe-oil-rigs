import { load } from 'cheerio';
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import { burstCache, CACHE_LOCATION, isCacheValid, updateCacheMeta } from './cache-buster';

async function getContent(): Promise<string> {
  const filePath = path.join(CACHE_LOCATION, 'amulet-anointments.html');

  if (!isCacheValid(filePath, 1000 * 3600 * 48 /** 2 days */)) {
    console.log('No cache found or outdated cache for amulet anointments, start fetching!');
    burstCache(filePath);
    const result = await fetch('https://poedb.tw/us/Amulets#AnointUniqueAmulets').then((res) => res.text());

    fs.writeFileSync(filePath, result);
    updateCacheMeta(filePath);
  }

  return fs.readFileSync(filePath, { encoding: 'utf-8' });
}

function parseAnointments(content: string) {
  const $ = load(content);
  const result: AmuletAnointment[] = [];

  const rows = $(`#AnointUniqueAmulets tbody tr`);

  rows.each((_, row) => {
    const oilCell = $('td:eq(1)', row);
    const oils: string[] = [
      $('a:eq(0)', oilCell).text().trim(),
      $('a:eq(1)', oilCell).text().trim(),
      $('a:eq(2)', oilCell).text().trim(),
    ];

    const anointment: AmuletAnointment = {
      notable: $('td:eq(2) a', row).text(),
      description: $('td:eq(2) .explicitMod', row).text().trim(),
      oils,
    };
    result.push(anointment);
  });

  return result;
}

export interface AmuletAnointment {
  oils: string[];
  notable: string;
  description: string;
}

export async function getAmuletAnointments() {
  const content = await getContent();
  const anointments = parseAnointments(content);
  return anointments;
}

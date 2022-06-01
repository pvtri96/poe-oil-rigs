import { load } from 'cheerio';
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';

async function getContent(): Promise<string> {
  const filePath = path.join(process.cwd(), 'resources', 'data', '.cache', 'amulet-anointments.html');

  if (!fs.existsSync(filePath)) {
    console.log('No cache found for anointments, start fetching!');
    const result = await fetch('https://poedb.tw/us/Amulets#AnointUniqueAmulets').then((res) => res.text());

    fs.writeFileSync(filePath, result);
  }

  return fs.readFileSync(filePath, { encoding: 'utf-8' });
}

function parseAnointments(content: string) {
  const $ = load(content);
  const result: AmuletAnointment[] = [];

  const rows = $(`#AnointUniqueAmulets tbody tr`);

  rows.each((_, row) => {
    const oilCell = $('td:eq(1)', row);
    const oils: string[] = [$('a:eq(0)', oilCell).text(), $('a:eq(1)', oilCell).text(), $('a:eq(2)', oilCell).text()];

    const anointment: AmuletAnointment = {
      notable: $('td:eq(2) a', row).text(),
      description: $('td:eq(2) .explicitMod', row).text(),
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

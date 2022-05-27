import { load } from 'cheerio';
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';

async function getContent(): Promise<string> {
  const filePath = path.join(process.cwd(), 'resources', 'data', 'ring-anointments.html');

  if (!fs.existsSync(filePath)) {
    console.log('No cache found for anointments, start fetching!');
    const result = await fetch('https://poedb.tw/us/Rings#AnointRings').then((res) => res.text());

    fs.writeFileSync(filePath, result);
  }

  return fs.readFileSync(filePath, { encoding: 'utf-8' });
}

function parseAnointments(content: string) {
  const $ = load(content);
  const result: RingAnointment[] = [];

  const rows = $(`#AnointRings tbody tr`);

  rows.each((_, row) => {
    const oilCell = $('td:eq(1)', row);
    const oils: string[] = [$('a:eq(0)', oilCell).text(), $('a:eq(1)', oilCell).text()];

    const anointment: RingAnointment = {
      mod: $('td:eq(2)', row).text(),
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

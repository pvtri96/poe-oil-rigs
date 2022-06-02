import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import { burstCache, CACHE_LOCATION, isCacheValid, updateCacheMeta } from './cache-buster';

async function getOilOverview(): Promise<OilsResponse> {
  const filePath = path.join(CACHE_LOCATION, 'oils.json');

  if (!isCacheValid(filePath)) {
    console.log('No cache found or outdated cache for oils, start fetching!');
    burstCache(filePath);
    const url = 'https://poe.ninja/api/data/ItemOverview?league=Sentinel&type=Oil&language=en';
    const result = await fetch(url).then((res) => res.json());

    fs.writeFileSync(filePath, JSON.stringify(result));
    updateCacheMeta(filePath);
  }

  const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
  return JSON.parse(content);
}

async function getCurrencyOverview(): Promise<CurrencyResponse> {
  const filePath = path.join(CACHE_LOCATION, 'currency.json');

  if (!isCacheValid(filePath)) {
    console.log('No cache found or outdated cache for currency, start fetching!');
    burstCache(filePath);
    const url = 'https://poe.ninja/api/data/CurrencyOverview?league=Sentinel&type=Currency&language=en';
    const result = await fetch(url).then((res) => res.json());

    fs.writeFileSync(filePath, JSON.stringify(result));
    updateCacheMeta(filePath);
  }

  const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
  return JSON.parse(content);
}

function getOilExtractor(currencyResponse: CurrencyResponse) {
  const oilExtractor = currencyResponse.lines.find((currency) => currency.currencyTypeName === 'Oil Extractor');
  if (!oilExtractor) {
    throw new Error('Cannot find Oil Extractor price');
  }

  return oilExtractor;
}

export async function getOilsAndExtractor(): Promise<[Oil[], Currency]> {
  const [oilOverview, currencyOverview] = await Promise.all([getOilOverview(), getCurrencyOverview()]);

  return [oilOverview.lines, getOilExtractor(currencyOverview)];
}

interface OilsResponse {
  lines: Oil[];
}

export interface Oil {
  id: number;
  name: string;
  icon: string;
  baseType: string;
  stackSize: number;
  itemClass: number;
  chaosValue: number;
  exaltedValue: number;
}

interface CurrencyResponse {
  lines: Currency[];
}

export interface Currency {
  currencyTypeName: string;
  chaosEquivalent: number;
  receive: {
    value: number;
    count: number;
    listing_count: number;
  };
}

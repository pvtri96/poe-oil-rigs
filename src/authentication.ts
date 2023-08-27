import fs from 'fs';
import inquirer from 'inquirer';
import path from 'path';
import { burstCache, CACHE_LOCATION, isCacheValid, updateCacheMeta } from './cache-buster';

const DEFAULT_LEAGUE = 'Ancestor';

export interface AuthenticationPayload {
  method: 'poesessid';
  accountName: string;
  poesessid: string;
  league: string;
}

export async function auth0() {
  // TODO: Need official approval from Chris Wilson to use the auth0 method
}

const filePath = path.join(CACHE_LOCATION, 'authentication.json');

export async function sessionid() {
  console.log(
    '\nPlease see https://cptpingu.github.io/poe-stash/poesessid.html for instruction how to retrieve the POESESSID.\n',
  );
  const answer = await inquirer.prompt([
    { name: 'accountName', message: 'Your account name' },
    { name: 'poesessid', message: 'Fill your POESESSID' },
    { name: 'league', message: 'Your current league', default: DEFAULT_LEAGUE },
  ]);

  const payload: AuthenticationPayload = { method: 'poesessid', ...answer };

  fs.writeFileSync(filePath, JSON.stringify(payload));
  updateCacheMeta(filePath);
}

export function getAuthentication(): AuthenticationPayload {
  if (!isCacheValid(filePath, 1000 * 3600 * 24 * 90 /** The id will be valid for a whole league lifespan 3 months */)) {
    console.log('No cache found or outdated cache for oils, start fetching!');
    burstCache(filePath);

    throw new Error(`Invalid authentication payload. Please re-run "login" command.`);
  }

  const file = fs.readFileSync(filePath, { encoding: 'utf-8' });
  return JSON.parse(file);
}

export function getLeague(): string {
  if(!fs.existsSync(filePath)) {
    return DEFAULT_LEAGUE;
  }

  const file = fs.readFileSync(filePath, { encoding: 'utf-8' });
  const auth = JSON.parse(file);
  return auth['league'];
}
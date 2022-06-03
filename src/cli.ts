import inquirer from 'inquirer';
import flow from 'lodash/flow';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
import { getAmuletAnointments } from './amulet-anointments';
import { sessionid } from './authentication';
import { getOilValueForAmulet, getOilValueForRing } from './calc';
import { getOilsAndExtractor } from './oils';
import { out } from './out';
import { getRingAnointments } from './ring-anointments';
import { getAmulets, getRings, getStash, withEnchant } from './stash';

yargs(hideBin(process.argv))
  .version(process.env.__NAME__ ?? 'build')
  .command('login', 'Login to let the tool be able to retrieve the stash API', (yargs) => yargs, login)
  .command('check', 'Do a price check for given stash tab', (yargs) => yargs, check)
  .command('$0', 'Check', (yargs) => yargs, check).argv;

async function login() {
  const answer = await inquirer.prompt({
    name: 'method',
    type: 'list',
    message: 'Choose your authentication method',
    choices: ['poesessid'],
    default: 'poesessid',
  });
  switch (answer['method']) {
    case 'poesessid':
      await sessionid();
      break;
    default:
      throw new Error(`Invalid authentication method.`);
  }
}

async function check() {
  const stash = await getStash();
  const rings = flow(getRings, withEnchant)(stash);
  const amulets = flow(getAmulets, withEnchant)(stash);

  const [oils, oilExtractor] = await getOilsAndExtractor();
  const ringAnointments = await getRingAnointments();
  const amuletAnointments = await getAmuletAnointments();

  const itemsWithValue = [
    ...getOilValueForRing(rings, ringAnointments, oils),
    ...getOilValueForAmulet(amulets, amuletAnointments, oils),
  ];

  out(itemsWithValue, oilExtractor);
}

import flow from 'lodash/flow';
import open from 'open';
import path from 'path';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
import { getAmuletAnointments } from './amulet-anointments';
import { getOilValueForAmulet, getOilValueForRing } from './calc';
import { getOilsAndExtractor } from './oils';
import { out } from './out';
import { getRingAnointments } from './ring-anointments';
import { getAmulets, getRings, getStash, withEnchant } from './stash';

yargs(hideBin(process.argv))
  .command(
    'get-stash',
    'Retrieve the stash information',
    (yargs) => {
      return yargs
        .positional('username', { describe: 'POE account name' })
        .positional('tab', { describe: 'Tab index', default: 0 });
    },
    async (argv) => {
      await open(
        `https://www.pathofexile.com/character-window/get-stash-items?league=Sentinel&tabs=1&tabIndex=${argv.tab}&accountName=${argv.username}`,
      );
    },
  )
  .command(
    'check',
    '',
    (yargs) => {
      return yargs.positional('path', {
        describe: 'JSON file which is retrieved from get-stash command',
        type: 'string',
        default: path.join(process.cwd(), 'resources', 'data', 'stash.json'),
      });
    },
    async (argv) => {
      const rings = flow(getStash, getRings, withEnchant)(argv.path);
      const amulets = flow(getStash, getAmulets, withEnchant)(argv.path);

      const [oils, oilExtractor] = await getOilsAndExtractor();
      const ringAnointments = await getRingAnointments();
      const amuletAnointments = await getAmuletAnointments();

      const itemsWithValue = [
        ...getOilValueForRing(rings, ringAnointments, oils),
        ...getOilValueForAmulet(amulets, amuletAnointments, oils),
      ];

      out(itemsWithValue, oilExtractor);
    },
  ).argv;

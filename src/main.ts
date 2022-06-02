import flow from 'lodash/flow';
import { getAmuletAnointments } from './amulet-anointments';
import { getOilValueForAmulet, getOilValueForRing } from './calc';
import { getOilsAndExtractor } from './oils';
import { out } from './out';
import { getRingAnointments } from './ring-anointments';
import { getAmulets, getRings, getStashFixture, withEnchant } from './stash';

async function main() {
  const rings = flow(getStashFixture, getRings, withEnchant)();
  const amulets = flow(getStashFixture, getAmulets, withEnchant)();

  const [oils, oilExtractor] = await getOilsAndExtractor();
  const ringAnointments = await getRingAnointments();
  const amuletAnointments = await getAmuletAnointments();

  const itemsWithValue = [
    ...getOilValueForRing(rings, ringAnointments, oils),
    ...getOilValueForAmulet(amulets, amuletAnointments, oils),
  ];

  out(itemsWithValue, oilExtractor);
}

main();

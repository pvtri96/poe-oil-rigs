import { AmuletAnointment } from './amulet-anointments';
import { Oil } from './oils';
import { RingAnointment } from './ring-anointments';
import { StashItem } from './stash';

export type CalculatedItem = [StashItem, Oil[], number, number];

export function getOilValueForRing(
  rings: StashItem[],
  anointments: RingAnointment[],
  oilPrices: Oil[],
): CalculatedItem[] {
  const result: [StashItem, Oil[], number, number][] = [];

  for (const ring of rings) {
    for (const anointment of anointments) {
      if (ring.enchantMods?.includes(anointment.mod)) {
        const oils: Oil[] = [];
        for (const anointedOil of anointment.oils) {
          const foundOil = oilPrices.find((oil) => anointedOil === oil.baseType);
          if (foundOil) oils.push(foundOil);
        }

        const value = oils.reduce((value, oil) => value + oil.chaosValue, 0);
        const avg = value / 2;

        result.push([ring, oils, value, avg]);
      }
    }
  }

  return result;
}

export function getOilValueForAmulet(
  amulets: StashItem[],
  anointments: AmuletAnointment[],
  oilPrices: Oil[],
): CalculatedItem[] {
  const result: [StashItem, Oil[], number, number][] = [];

  for (const amulet of amulets) {
    for (const anointment of anointments) {
      if (amulet.enchantMods?.includes(`Allocates ${anointment.notable}`)) {
        const oils: Oil[] = [];
        for (const anointedOil of anointment.oils) {
          const foundOil = oilPrices.find((oil) => anointedOil === oil.baseType);
          if (foundOil) oils.push(foundOil);
        }

        const value = oils.reduce((value, oil) => value + oil.chaosValue, 0);
        const avg = value / 3;

        result.push([amulet, oils, value, avg]);
      }
    }
  }

  return result;
}

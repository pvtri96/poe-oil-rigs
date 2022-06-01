import { CalculatedItem } from './calc';
import { Currency } from './oils';

export function out(calculatedItems: CalculatedItem[], oilExtractor: Currency) {
  const valuableItems = calculatedItems
    .filter(([, , , avg]) => avg > oilExtractor.receive.value * 2.5)
    .sort(([, , , a], [, , , b]) => b - a);

  console.group('Items');
  console.table(
    calculatedItems.map(([item, oils, value]) => {
      return {
        name: item.name || item.baseType,
        enchant: item.enchantMods,
        oils: oils.map((oil) => oil.baseType),
        value: value,
      };
    }),
  );
  console.groupEnd();

  console.group('Valuable items');
  console.log('The current price of Oil Extractor is', oilExtractor.receive.value);

  console.table(
    valuableItems.map(([item, oils, value, avg]) => {
      return {
        name: item.name || item.baseType,
        enchant: item.enchantMods,
        oils: oils.map((oil) => oil.baseType),
        value: value,
        avg: avg,
        x: item.x,
        y: item.y,
      };
    }),
  );
  console.groupEnd();
}

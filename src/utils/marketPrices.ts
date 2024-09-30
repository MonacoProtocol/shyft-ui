import { ConvertedLiquidity, GQLOutcome, GQLPrice } from '@/types/markets';

export interface GQLOutcomeWithPrice extends GQLOutcome {
  forPrices: ConvertedLiquidity[];
  againstPrices: ConvertedLiquidity[];
}

const emptyPrice = {
  price: 0,
  outcome: 0,
  liquidity: 0,
};

export const mapPricesToOutcomesAndFillEmptySlots = (
  price: GQLPrice,
  outcomes: GQLOutcome[],
): GQLOutcomeWithPrice[] => {
  const forPrices = price.liquiditiesFor;
  const againstPrices = price.liquiditiesAgainst;

  return outcomes.map((outcome) => {
    const forPricesFiltered = forPrices
      .filter((price) => price.outcome === outcome.index)

    const forPricesConverted = forPricesFiltered.map((price) => ({
      price: parseFloat(price.price),
      outcome: price.outcome,
      liquidity: parseFloat(price.liquidity),
    })).sort((a, b) => (b.price < a.price ? 1 : -1));

    const againstPricesFiltered = againstPrices
      .filter((price) => price.outcome === outcome.index)

    const againstPricesConverted = againstPricesFiltered.map((price) => ({
      price: parseFloat(price.price),
      outcome: price.outcome,
      liquidity: parseFloat(price.liquidity),
    })).sort((a, b) => (b.price < a.price ? 1 : -1));

    while (forPricesConverted.length < 3) {
      forPricesConverted.push(emptyPrice);
    }
    while (againstPricesConverted.length < 3) {
      againstPricesConverted.unshift(emptyPrice);
    }
    return {
      ...outcome,
      forPrices: [...forPricesConverted],
      againstPrices: [...againstPricesConverted],
    };
  });
};

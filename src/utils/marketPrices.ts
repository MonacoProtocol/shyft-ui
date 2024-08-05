import { GQLOutcome, GQLPrice } from '@/types/markets';

export interface GQLOutcomeWithPrice extends GQLOutcome {
  forPrices: GQLPrice[];
  againstPrices: GQLPrice[];
}

const emptyPrice = {
  forOutcome: true,
  liquidityAmount: 0,
  market: '',
  marketOutcomeIndex: 0,
  matchedAmount: 0,
  price: 0,
  pubkey: '',
};

export const mapPricesToOutcomesAndFillEmptySlots = (
  prices: GQLPrice[],
  outcomes: GQLOutcome[],
): GQLOutcomeWithPrice[] => {
  const forPrices = prices.filter((price) => price.forOutcome === true);
  const againstPrices = prices.filter((price) => price.forOutcome === false);

  return outcomes.map((outcome) => {
    const forPricesFiltered = forPrices
      .filter((price) => price.marketOutcomeIndex === outcome.index)
      .sort((a, b) => (b.price < a.price ? 1 : -1));

    const againstPricesFiltered = againstPrices
      .filter((price) => price.marketOutcomeIndex === outcome.index)
      .sort((a, b) => (b.price < a.price ? 1 : -1));

    while (forPricesFiltered.length < 3) {
      forPricesFiltered.push(emptyPrice);
    }
    while (againstPricesFiltered.length < 3) {
      againstPricesFiltered.unshift(emptyPrice);
    }
    return {
      ...outcome,
      forPrices: [...forPricesFiltered],
      againstPrices: [...againstPricesFiltered],
    };
  });
};

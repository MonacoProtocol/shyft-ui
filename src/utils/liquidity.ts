import { GQLPrice } from "@/types/markets";

export const addUpLiquidity = (prices: GQLPrice): number => {
    let totalLiquidity = 0;
    prices.liquiditiesFor.forEach((liquidity) => {
      totalLiquidity += Number(liquidity.liquidity);
    });
    prices.liquiditiesAgainst.forEach((liquidity) => {
      totalLiquidity += Number(liquidity.liquidity);
    });
    return totalLiquidity;
  };

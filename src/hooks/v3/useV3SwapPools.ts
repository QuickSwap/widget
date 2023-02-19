import { Currency } from '@uniswap/sdk-core';
import { PoolState, usePools } from 'hooks/usePools';
import { Pool } from 'lib/src/pool';
import { useMemo } from 'react';
import { useAllCurrencyCombinations } from './useAllCurrencyCombinations';

/**
 * Returns all the existing pools that should be considered for swapping between an input currency and an output currency
 * @param currencyIn the input currency
 * @param currencyOut the output currency
 */
export function useV3SwapPools(
  currencyIn?: Currency,
  currencyOut?: Currency,
): {
  pools: Pool[];
  loading: boolean;
} {
  const allCurrencyCombinations = useAllCurrencyCombinations(
    currencyIn,
    currencyOut,
  );

  // const allCurrencyCombinationsWithAllFees: [Token, Token, FeeAmount][] = useMemo(
  //   () =>
  //     allCurrencyCombinations
  //   [allCurrencyCombinations]
  // )

  const pools = usePools(allCurrencyCombinations);

  return useMemo(() => {
    return {
      pools: pools
        .filter((tuple): tuple is [PoolState.EXISTS, Pool] => {
          return tuple[0] === PoolState.EXISTS && tuple[1] !== null;
        })
        .map(([, pool]) => pool),
      loading: pools.some(([state]) => state === PoolState.LOADING),
    };
  }, [pools]);
}

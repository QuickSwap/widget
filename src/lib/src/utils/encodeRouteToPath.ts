import { pack } from '@ethersproject/solidity';
import { Currency, Token } from '@uniswap/sdk-core';
import { Pool } from '../pool';
import { Route } from '../route';
import { FeeAmount } from 'v3lib/utils';

/**
 * Converts a route to a hex encoded path
 * @param route the v3 path to convert to an encoded path
 * @param exactOutput whether the route should be encoded in reverse, for making exact output swaps
 */
export function encodeRouteToPath(
  route: Route<Currency, Currency>,
  exactOutput: boolean,
  isUni?: boolean,
): string {
  const firstInputToken: Token = route.input.wrapped;

  const { path, types } = route.pools.reduce(
    (
      {
        inputToken,
        path,
        types,
      }: { inputToken: Token; path: (string | number)[]; types: string[] },
      pool: Pool,
      index,
    ): { inputToken: Token; path: (string | number)[]; types: string[] } => {
      const outputToken: Token = pool.token0.equals(inputToken)
        ? pool.token1
        : pool.token0;
      if (index === 0) {
        return {
          inputToken: outputToken,
          types: isUni
            ? ['address', 'uint24', 'address']
            : ['address', 'address'],
          path: isUni
            ? [inputToken.address, pool.fee as FeeAmount, outputToken.address]
            : [inputToken.address, outputToken.address],
        };
      } else {
        return {
          inputToken: outputToken,
          types: isUni
            ? [...types, 'uint24', 'address']
            : [...types, 'address'],
          path: isUni
            ? [...path, pool.fee as FeeAmount, outputToken.address]
            : [...path, outputToken.address],
        };
      }
    },
    { inputToken: firstInputToken, path: [], types: [] },
  );

  return exactOutput
    ? pack(types.reverse(), path.reverse())
    : pack(types, path);
}

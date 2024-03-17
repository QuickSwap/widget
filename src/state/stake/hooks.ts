import { ChainId, JSBI, TokenAmount } from '@uniswap/sdk';
import { NEW_QUICK, OLD_QUICK } from 'constants/v3/addresses';
import { useActiveWeb3React } from 'hooks';
import { useLairContract, useNewLairContract } from 'hooks/useContract';
import { useSingleCallResult } from 'state/multicall/v3/hooks';

export function useDQUICKtoQUICK(isNew?: boolean, noFetch?: boolean) {
  const { chainId } = useActiveWeb3React();
  const chainIdToUse = chainId ? chainId : ChainId.MATIC;

  const lair = useLairContract(chainIdToUse);
  const newLair = useNewLairContract();

  const inputs = ['1000000000000000000'];
  const dQuickToQuickState = useSingleCallResult(
    noFetch ? null : isNew ? newLair : lair,
    'dQUICKForQUICK',
    inputs,
  );
  if (dQuickToQuickState.loading || dQuickToQuickState.error) return 0;

  const quickToken = isNew ? NEW_QUICK[chainIdToUse] : OLD_QUICK[chainIdToUse];

  return !noFetch && quickToken
    ? Number(
        new TokenAmount(
          quickToken,
          JSBI.BigInt(dQuickToQuickState?.result?.[0] ?? 0),
        ).toExact(),
      )
    : 0;
}

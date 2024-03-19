import { useEffect, useState, useCallback, useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ChainId, Pair } from '@uniswap/sdk';
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks';
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks';
import { usePairs } from 'data/Reserves';
import { SUPPORTED_CHAINIDS } from 'constants/index';
import { Connector } from '@web3-react/types';
import {
  ConnectionType,
  arkaneConnection,
  bitgetConnection,
  blockWalletConnection,
  braveWalletConnection,
  coinbaseWalletConnection,
  cryptoComConnection,
  cypherDConnection,
  getConnections,
  gnosisSafeConnection,
  metamaskConnection,
  networkConnection,
  okxWalletConnection,
  phantomConnection,
  trustWalletConnection,
  walletConnectConnection,
  unstoppableDomainsConnection,
  binanceWalletConnection,
} from 'connectors';
import { getConfig } from 'config';
import useParsedQueryString from './useParsedQueryString';
import {
  useOpenNetworkSelection,
  useWalletModalToggle,
} from 'state/application/hooks';

export function useActiveWeb3React() {
  const context = useWeb3React();

  const chainId: ChainId | undefined = useMemo(() => {
    if (!context.chainId || !SUPPORTED_CHAINIDS.includes(context.chainId)) {
      return ChainId.MATIC;
    }
    return context.chainId;
  }, [context.chainId]);

  return {
    ...context,
    chainId,
    currentChainId: context.chainId,
    library: context.provider,
  };
}

export function useGetConnection() {
  return useCallback((c: Connector | ConnectionType) => {
    if (c instanceof Connector) {
      const connection = getConnections().find(
        (connection) => connection.connector === c,
      );
      if (!connection) {
        throw Error('unsupported connector');
      }
      return connection;
    } else {
      switch (c) {
        case ConnectionType.METAMASK:
          return metamaskConnection;
        case ConnectionType.COINBASE_WALLET:
          return coinbaseWalletConnection;
        case ConnectionType.WALLET_CONNECT:
          return walletConnectConnection;
        case ConnectionType.NETWORK:
          return networkConnection;
        case ConnectionType.GNOSIS_SAFE:
          return gnosisSafeConnection;
        case ConnectionType.ARKANE:
          return arkaneConnection;
        case ConnectionType.PHATOM:
          return phantomConnection;
        case ConnectionType.TRUSTWALLET:
          return trustWalletConnection;
        case ConnectionType.BITGET:
          return bitgetConnection;
        case ConnectionType.BLOCKWALLET:
          return blockWalletConnection;
        case ConnectionType.BRAVEWALLET:
          return braveWalletConnection;
        case ConnectionType.CYPHERD:
          return cypherDConnection;
        case ConnectionType.OKXWALLET:
          return okxWalletConnection;
        case ConnectionType.CRYPTOCOM:
          return cryptoComConnection;
        case ConnectionType.UNSTOPPABLEDOMAINS:
          return unstoppableDomainsConnection;
        case ConnectionType.BINANCEWALLET:
          return binanceWalletConnection;
        default:
          throw Error('unsupported connector');
      }
    }
  }, []);
}

export function useV2LiquidityPools(account?: string) {
  const trackedTokenPairs = useTrackedTokenPairs();
  const tokenPairsWithLiquidityTokens = useMemo(
    () =>
      trackedTokenPairs.map((tokens) => ({
        liquidityToken: toV2LiquidityToken(tokens),
        tokens,
      })),
    [trackedTokenPairs],
  );
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  );
  const [
    v2PairsBalances,
    fetchingV2PairBalances,
  ] = useTokenBalancesWithLoadingIndicator(account, liquidityTokens);

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  );

  const v2Pairs = usePairs(
    liquidityTokensWithBalances.map(({ tokens }) => tokens),
  );
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    v2Pairs?.some((V2Pair) => !V2Pair);

  const allV2PairsWithLiquidity = v2Pairs
    .map(([, pair]) => pair)
    .filter((v2Pair): v2Pair is Pair => Boolean(v2Pair));

  return { loading: v2IsLoading, pairs: allV2PairsWithLiquidity };
}

export const useIsProMode = () => {
  const { chainId } = useActiveWeb3React();
  const config = getConfig(chainId);
  const proModeEnabled = config['swap']['proMode'];
  const parsedQs = useParsedQueryString();
  const isProMode = Boolean(
    parsedQs.isProMode && parsedQs.isProMode === 'true',
  );
  return proModeEnabled && isProMode;
};

export const useConnectWallet = (isSupportedNetwork: boolean) => {
  const toggleWalletModal = useWalletModalToggle();
  const { setOpenNetworkSelection } = useOpenNetworkSelection();

  const connectWallet = () => {
    if (!isSupportedNetwork) {
      setOpenNetworkSelection(true);
    } else {
      toggleWalletModal();
    }
  };

  return { connectWallet };
};

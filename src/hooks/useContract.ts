import { Contract } from '@ethersproject/contracts';
import { ChainId, WETH } from '@uniswap/sdk';
import iUniswapV2Pair from '@uniswap/v2-core/build/IUniswapV2Pair.json';
import { useMemo } from 'react';
import {
  ARGENT_WALLET_DETECTOR_ABI,
  ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS,
} from 'constants/abis/argent-wallet-detector';
import ENS_PUBLIC_RESOLVER_ABI from 'constants/abis/ens-public-resolver.json';
import ENS_ABI from 'constants/abis/ens-registrar.json';
import EIP_2612 from 'constants/abis/v3/eip_2612.json';
import ERC20_ABI, { ERC20_BYTES32_ABI } from 'constants/abis/erc20';
import WETH_ABI from 'constants/abis/weth.json';
import NATIVE_CONVERTER_ABI from 'constants/abis/nativeConverter.json';
import { MULTICALL_ABI } from 'constants/multicall';
import { V1_FACTORY_ABI, V1_FACTORY_ADDRESSES } from 'constants/v1';
import { getContract } from 'utils';
import { useActiveWeb3React } from 'hooks';
import dragonsLair from 'abis/DragonLair.json';
import router02 from '@uniswap/v2-periphery/build/IUniswapV2Router02.json';
import QUICKConversionABI from 'constants/abis/quick-conversion.json';
import {
  MULTICALL_ADDRESS,
  QUOTER_ADDRESSES,
  MULTICALL_NETWORKS,
  V2_ROUTER_ADDRESS,
  LAIR_ADDRESS,
  QUICK_ADDRESS,
  NEW_LAIR_ADDRESS,
  QUICK_CONVERSION,
  DL_QUICK_ADDRESS,
  UNIV3_QUOTER_ADDRESSES,
  NATIVE_CONVERTER,
} from 'constants/v3/addresses';
import NewQuoterABI from 'constants/abis/v3/quoter.json';
import UniV3QuoterABI from 'constants/abis/uni-v3/quoter.json';
import MULTICALL2_ABI from 'constants/abis/v3/multicall.json';

const LairABI = dragonsLair.abi;
const IUniswapV2Router02ABI = router02.abi;
const IUniswapV2PairABI = iUniswapV2Pair.abi;

export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true,
): T | null {
  const { library, account, chainId } = useActiveWeb3React();

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !library || !chainId) return null;
    let address: string | undefined;
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap;
    else address = addressOrAddressMap[chainId];
    if (!address) return null;
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined,
      );
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [
    addressOrAddressMap,
    ABI,
    library,
    chainId,
    withSignerIfPossible,
    account,
  ]) as T;
}

export function useContracts<T extends Contract = Contract>(
  addressOrAddressMaps: string[] | { [chainId: number]: string }[] | undefined,
  ABI: any,
  withSignerIfPossible = true,
): (T | null)[] {
  const { library, account, chainId } = useActiveWeb3React();

  return useMemo(() => {
    if (!addressOrAddressMaps || !ABI || !library || !chainId) return [];
    return addressOrAddressMaps.map((addressOrAddressMap) => {
      let address: string | undefined;
      if (typeof addressOrAddressMap === 'string')
        address = addressOrAddressMap;
      else address = addressOrAddressMap[chainId];
      if (!address) return null;
      try {
        return getContract(
          address,
          ABI,
          library,
          withSignerIfPossible && account ? account : undefined,
        );
      } catch (error) {
        console.error('Failed to get contract', error);
        return null;
      }
    });
  }, [
    addressOrAddressMaps,
    ABI,
    library,
    chainId,
    withSignerIfPossible,
    account,
  ]) as (T | null)[];
}

export function useLairContract(chainId?: ChainId): Contract | null {
  return useContract(
    chainId ? LAIR_ADDRESS[chainId] : LAIR_ADDRESS,
    LairABI,
    true,
  );
}

export function useQUICKContract(): Contract | null {
  return useContract(QUICK_ADDRESS, ERC20_ABI, true);
}

export function useNewLairContract(): Contract | null {
  return useContract(NEW_LAIR_ADDRESS, LairABI, true);
}

export function useNewQUICKContract(): Contract | null {
  return useContract(DL_QUICK_ADDRESS, ERC20_ABI, true);
}

export function useQUICKConversionContract(): Contract | null {
  return useContract(QUICK_CONVERSION, QUICKConversionABI, true);
}

export function useV1FactoryContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && V1_FACTORY_ADDRESSES[chainId],
    V1_FACTORY_ABI,
    false,
  );
}

export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean,
): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useWETHContract(
  withSignerIfPossible?: boolean,
): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId ? WETH[chainId].address : undefined,
    WETH_ABI,
    withSignerIfPossible,
  );
}

export function useNativeConverterContract(
  withSignerIfPossible?: boolean,
): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId ? NATIVE_CONVERTER[chainId] : undefined,
    NATIVE_CONVERTER_ABI,
    withSignerIfPossible,
  );
}

export function useArgentWalletDetectorContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId === ChainId.MATIC
      ? ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS
      : undefined,
    ARGENT_WALLET_DETECTOR_ABI,
    false,
  );
}

export function useENSRegistrarContract(
  withSignerIfPossible?: boolean,
): Contract | null {
  const { chainId } = useActiveWeb3React();
  let address: string | undefined;
  if (chainId) {
    switch (chainId) {
      case ChainId.MATIC:
        address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'; //TODO: MATIC
        break;
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible);
}

export function useENSResolverContract(
  address: string | undefined,
  withSignerIfPossible?: boolean,
): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible);
}

export function useBytes32TokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean,
): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible);
}

export function usePairContract(
  pairAddress?: string,
  withSignerIfPossible?: boolean,
): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible);
}

export function useEIP2612Contract(tokenAddress?: string): Contract | null {
  return useContract(tokenAddress, EIP_2612, false);
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && MULTICALL_NETWORKS[chainId],
    MULTICALL_ABI,
    false,
  );
}

export function useMulticall2Contract() {
  return useContract(MULTICALL_ADDRESS, MULTICALL2_ABI, false);
}

export function useRouterContract(): Contract | null {
  const { chainId, account } = useActiveWeb3React();
  return useContract(
    chainId ? V2_ROUTER_ADDRESS[chainId] : undefined,
    IUniswapV2Router02ABI,
    Boolean(account),
  );
}

export function useV3Quoter() {
  return useContract(QUOTER_ADDRESSES, NewQuoterABI);
}
export function useUniV3Quoter() {
  return useContract(UNIV3_QUOTER_ADDRESSES, UniV3QuoterABI);
}

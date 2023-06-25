import { getAddress } from '@ethersproject/address';
import { ApolloClient } from 'apollo-client';
import { Contract } from '@ethersproject/contracts';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { blockClient, clientV2, clientV3 } from 'apollo/client';
import { GET_BLOCK, GET_BLOCKS, ETH_PRICE } from 'apollo/queries';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import {
  CurrencyAmount,
  ChainId,
  Percent,
  JSBI,
  Currency,
  ETHER,
  Token,
  TokenAmount,
} from '@uniswap/sdk';
import { Currency as CurrencyV3 } from '@uniswap/sdk-core';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { formatUnits } from 'ethers/lib/utils';
import { AddressZero } from '@ethersproject/constants';
import { GlobalConst, GlobalValue, SUPPORTED_CHAINIDS } from 'constants/index';
import { TokenAddressMap } from 'state/lists/hooks';
import { Connector } from '@web3-react/types';
import { getConfig } from 'config';
import { TFunction } from 'react-i18next';
import { MATIC_PRICE_V3 } from 'apollo/queries-v3';
import { Connection, getConnections } from 'connectors';
import { useActiveWeb3React } from 'hooks';

dayjs.extend(utc);
dayjs.extend(weekOfYear);

export { default as addMaticToMetamask } from './addMaticToMetamask';

interface BasicData {
  token0?: {
    id: string;
    name: string;
    symbol: string;
  };
  token1?: {
    id: string;
    name: string;
    symbol: string;
  };
}

const TOKEN_OVERRIDES: {
  [address: string]: { name: string; symbol: string };
} = {
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': {
    name: 'Ether (Wrapped)',
    symbol: 'ETH',
  },
  '0x1416946162b1c2c871a73b07e932d2fb6c932069': {
    name: 'Energi',
    symbol: 'NRGE',
  },
};

export async function getBlockFromTimestamp(
  timestamp: number,
  chainId: ChainId,
): Promise<any> {
  const result = await blockClient[chainId].query({
    query: GET_BLOCK,
    variables: {
      timestampFrom: timestamp,
      timestampTo: timestamp + 600,
    },
    fetchPolicy: 'network-only',
  });
  return result?.data?.blocks?.[0]?.number;
}

export function formatCompact(
  unformatted: number | string | BigNumber | BigNumberish | undefined | null,
  decimals = 18,
  maximumFractionDigits: number | undefined = 3,
  maxPrecision: number | undefined = 4,
): string {
  const formatter = Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits,
  });

  if (!unformatted) return '0';

  if (unformatted === Infinity) return '∞';

  let formatted: string | number = Number(unformatted);

  if (unformatted instanceof BigNumber) {
    formatted = Number(formatUnits(unformatted.toString(), decimals));
  }

  return formatter.format(Number(formatted.toPrecision(maxPrecision)));
}

export const getPercentChange = (valueNow: number, value24HoursAgo: number) => {
  const adjustedPercentChange =
    ((valueNow - value24HoursAgo) / value24HoursAgo) * 100;
  if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
    return 0;
  }
  return adjustedPercentChange;
};

export async function splitQuery(
  query: any,
  localClient: ApolloClient<any>,
  vars: any[],
  list: any[],
  skipCount = 100,
): Promise<any> {
  let fetchedData = {};
  let allFound = false;
  let skip = 0;

  while (!allFound) {
    let end = list.length;
    if (skip + skipCount < list.length) {
      end = skip + skipCount;
    }
    const sliced = list.slice(skip, end);
    const queryStr = query(...vars, sliced);
    const result = await localClient.query({
      query: queryStr,
      fetchPolicy: 'network-only',
    });
    fetchedData = {
      ...fetchedData,
      ...result.data,
    };
    if (
      Object.keys(result.data).length < skipCount ||
      skip + skipCount > list.length
    ) {
      allFound = true;
    } else {
      skip += skipCount;
    }
  }

  return fetchedData;
}

export async function getBlocksFromTimestamps(
  timestamps: number[],
  skipCount = 500,
  chainId: ChainId,
): Promise<
  {
    timestamp: string;
    number: any;
  }[]
> {
  if (timestamps?.length === 0) {
    return [];
  }

  const fetchedData: any = await splitQuery(
    GET_BLOCKS,
    blockClient[chainId],
    [],
    timestamps,
    skipCount,
  );

  const blocks = [];
  if (fetchedData) {
    for (const t in fetchedData) {
      if (fetchedData[t].length > 0) {
        blocks.push({
          timestamp: t.split('t')[1],
          number: Number(fetchedData[t][0]['number']),
        });
      }
    }
  }

  return blocks;
}

export const get2DayPercentChange = (
  valueNow: number,
  value24HoursAgo: number,
  value48HoursAgo: number,
) => {
  // get volume info for both 24 hour periods
  const currentChange = valueNow - value24HoursAgo;
  const previousChange = value24HoursAgo - value48HoursAgo;

  const adjustedPercentChange =
    ((currentChange - previousChange) / previousChange) * 100;

  if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
    return [currentChange, 0];
  }
  return [currentChange, adjustedPercentChange];
};

export const getEthPrice: (chainId: ChainId) => Promise<number[]> = async (
  chainId: ChainId,
) => {
  const utcCurrentTime = dayjs();
  const utcOneDayBack = utcCurrentTime.subtract(1, 'day').unix();
  let ethPrice = 0;
  let ethPriceOneDay = 0;
  let priceChangeETH = 0;

  try {
    const oneDayBlock = await getBlockFromTimestamp(utcOneDayBack, chainId);

    const result = await clientV2[chainId].query({
      query: ETH_PRICE(),
      fetchPolicy: 'network-only',
    });
    const currentPrice = Number(result?.data?.bundles[0]?.ethPrice ?? 0);
    ethPrice = currentPrice;
    const resultOneDay = await clientV2[chainId].query({
      query: ETH_PRICE(oneDayBlock),
      fetchPolicy: 'network-only',
    });
    const oneDayBackPrice = Number(
      resultOneDay?.data?.bundles[0]?.ethPrice ?? 0,
    );

    priceChangeETH = getPercentChange(currentPrice, oneDayBackPrice);
    ethPriceOneDay = oneDayBackPrice;
  } catch (e) {
    console.log(e);
  }

  return [ethPrice, ethPriceOneDay, priceChangeETH];
};

export const getMaticPrice: (chainId: ChainId) => Promise<number[]> = async (
  chainId: ChainId,
) => {
  const utcCurrentTime = dayjs();

  const utcOneDayBack = utcCurrentTime.subtract(1, 'day').unix();
  let maticPrice = 0;
  let maticPriceOneDay = 0;
  let priceChangeMatic = 0;

  try {
    const oneDayBlock = await getBlockFromTimestamp(utcOneDayBack, chainId);
    const client = clientV3[chainId];
    if (client) {
      const result = await client.query({
        query: MATIC_PRICE_V3(),
        fetchPolicy: 'network-only',
      });
      const resultOneDay = await client.query({
        query: MATIC_PRICE_V3(oneDayBlock),
        fetchPolicy: 'network-only',
      });
      const currentPrice = Number(result?.data?.bundles[0]?.maticPriceUSD ?? 0);
      const oneDayBackPrice = Number(
        resultOneDay?.data?.bundles[0]?.maticPriceUSD ?? 0,
      );

      priceChangeMatic = getPercentChange(currentPrice, oneDayBackPrice);
      maticPrice = currentPrice;
      maticPriceOneDay = oneDayBackPrice;
    }
  } catch (e) {
    console.log(e);
  }

  return [maticPrice, maticPriceOneDay, priceChangeMatic];
};

export function getSecondsOneDay() {
  return 60 * 60 * 24;
}

export function updateNameData(data: BasicData): BasicData | undefined {
  if (
    data?.token0?.id &&
    Object.keys(TOKEN_OVERRIDES).includes(data.token0.id)
  ) {
    data.token0.name = TOKEN_OVERRIDES[data.token0.id].name;
    data.token0.symbol = TOKEN_OVERRIDES[data.token0.id].symbol;
  }

  if (
    data?.token1?.id &&
    Object.keys(TOKEN_OVERRIDES).includes(data.token1.id)
  ) {
    data.token1.name = TOKEN_OVERRIDES[data.token1.id].name;
    data.token1.symbol = TOKEN_OVERRIDES[data.token1.id].symbol;
  }

  return data;
}

export function isAddress(value: string | null | undefined): string | false {
  try {
    return getAddress(value || '');
  } catch {
    return false;
  }
}

/**
 * Given the price impact, get user confirmation.
 *
 * @param priceImpactWithoutFee price impact of the trade without the fee.
 */
export function confirmPriceImpactWithoutFee(
  priceImpactWithoutFee: Percent,
  translation: TFunction,
): boolean {
  if (
    !priceImpactWithoutFee.lessThan(
      GlobalValue.percents.PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN,
    )
  ) {
    return (
      window.prompt(
        translation('typeConfirmSwapPriceImpact', {
          priceImpact: GlobalValue.percents.PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN.toFixed(
            0,
          ),
        }),
      ) === 'confirm'
    );
  } else if (
    !priceImpactWithoutFee.lessThan(
      GlobalValue.percents.ALLOWED_PRICE_IMPACT_HIGH,
    )
  ) {
    return window.confirm(
      translation('confirmSwapPriceImpact', {
        priceImpact: GlobalValue.percents.ALLOWED_PRICE_IMPACT_HIGH.toFixed(0),
      }),
    );
  }
  return true;
}

export function currencyId(currency: Currency, chainId: ChainId): string {
  if (currency === ETHER[chainId]) return 'ETH';
  if (currency instanceof Token) return currency.address;
  throw new Error('invalid currency');
}

export function calculateSlippageAmount(
  value: CurrencyAmount,
  slippage: number,
): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`);
  }
  return [
    JSBI.divide(
      JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)),
      JSBI.BigInt(10000),
    ),
    JSBI.divide(
      JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)),
      JSBI.BigInt(10000),
    ),
  ];
}

export function maxAmountSpend(
  chainId: ChainId,
  currencyAmount?: CurrencyAmount,
): CurrencyAmount | undefined {
  if (!currencyAmount) return undefined;
  if (currencyAmount.currency === ETHER[chainId]) {
    if (JSBI.greaterThan(currencyAmount.raw, GlobalConst.utils.MIN_ETH)) {
      return CurrencyAmount.ether(
        JSBI.subtract(currencyAmount.raw, GlobalConst.utils.MIN_ETH),
        chainId,
      );
    } else {
      return CurrencyAmount.ether(JSBI.BigInt(0), chainId);
    }
  }
  return currencyAmount;
}

export function isTokensOnList(
  defaultTokens: TokenAddressMap,
  currencies: (Currency | undefined)[],
  chainId: ChainId,
): boolean[] {
  return currencies.map((currency) => {
    if (currency === ETHER[chainId] || (currency as CurrencyV3).isNative)
      return true;
    return Boolean(
      currency instanceof Token &&
        defaultTokens[currency.chainId]?.[currency.address],
    );
  });
}

export enum ExplorerDataType {
  TRANSACTION = 'transaction',
  TOKEN = 'token',
  ADDRESS = 'address',
  BLOCK = 'block',
}

export function getEtherscanLink(
  chainId: ChainId,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block' | ExplorerDataType,
): string {
  const config = getConfig(chainId);
  const prefix = config.blockExplorer;

  switch (type) {
    case 'transaction':
    case ExplorerDataType.TRANSACTION: {
      return `${prefix}/tx/${data}`;
    }
    case 'token':
    case ExplorerDataType.TOKEN: {
      return `${prefix}/token/${data}`;
    }
    case 'block':
    case ExplorerDataType.BLOCK: {
      return `${prefix}/block/${data}`;
    }
    case 'address':
    case ExplorerDataType.ADDRESS:
    default: {
      return `${prefix}/address/${data}`;
    }
  }
}

export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000));
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

export const shortenTx = (tx: string) => {
  if (tx.length) {
    const txLength = tx.length;
    const first = tx.slice(0, 6);
    const last = tx.slice(txLength - 4, txLength);
    return `${first}...${last}`;
  }
  return '';
};

export function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider, 'any');
  library.pollingInterval = 15000;
  return library;
}

export function isZero(hexNumberString: string): boolean {
  return /^0x0*$/.test(hexNumberString);
}

export function getSigner(
  library: Web3Provider,
  account: string,
): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

export function getProviderOrSigner(
  library: Web3Provider,
  account?: string,
): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

export function getContract(
  address: string,
  ABI: any,
  library: Web3Provider,
  account?: string,
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(
    address,
    ABI,
    getProviderOrSigner(library, account) as any,
  );
}

export function calculateGasMargin(value: BigNumber): BigNumber {
  return value
    .mul(BigNumber.from(10000).add(BigNumber.from(1000)))
    .div(BigNumber.from(10000));
}

export function calculateGasMarginBonus(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(2));
}

export function formatDateFromTimeStamp(
  timestamp: number,
  format: string,
  addedDay = 0,
) {
  return dayjs
    .unix(timestamp)
    .add(addedDay, 'day')
    .utc()
    .format(format);
}

export function formatNumber(
  unformatted: number | string | undefined,
  showDigits = 2,
) {
  // get fraction digits for small number
  if (!unformatted) return 0;
  const absNumber = Math.abs(Number(unformatted));
  if (absNumber > 0) {
    const digits = Math.ceil(Math.log10(1 / absNumber));
    if (digits < 3) {
      return Number(unformatted).toLocaleString('us');
    } else {
      return Number(unformatted).toFixed(digits + showDigits);
    }
  } else {
    return 0;
  }
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function getWalletKeys(connector: Connector): Connection[] {
  const connections = getConnections();

  return connections.filter((option) => option.connector === connector);
}

export function getTokenAddress(token: Token | undefined) {
  if (!token) return;
  if (token.symbol?.toLowerCase() === 'wmatic') return 'ETH';
  return token.address;
}

export function formatTokenAmount(
  amount?: TokenAmount | CurrencyAmount,
  digits = 3,
) {
  if (!amount) return '-';
  const amountStr = amount.toExact();
  if (Math.abs(Number(amountStr)) > 1) {
    return Number(amountStr).toLocaleString('us');
  }
  return amount.toSignificant(digits);
}

export function getUSDString(usdValue?: CurrencyAmount) {
  if (!usdValue) return '$0';
  const value = Number(usdValue.toExact());
  if (value > 0 && value < 0.001) return '< $0.001';
  return `$${value.toLocaleString('us')}`;
}

export function useIsSupportedNetwork() {
  const { currentChainId, chainId } = useActiveWeb3React();
  if (currentChainId) return !!SUPPORTED_CHAINIDS.includes(currentChainId);
  if (!chainId) return true;
  return !!SUPPORTED_CHAINIDS.includes(chainId);
}

export function getExactTokenAmount(amount?: TokenAmount | CurrencyAmount) {
  if (!amount) return 0;
  return Number(amount.toExact());
}

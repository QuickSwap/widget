import { ChainId, JSBI, Percent, WETH } from '@uniswap/sdk';
import {
  DAI,
  MI,
  USDC,
  USDT,
  axlUSDC,
  BOB,
  TUSD,
  UND,
  USDD,
  DAVOS,
  ETHER,
  WBTC,
  MATICX,
  STMATIC,
  ANKRMATIC,
  RMATIC,
  NEW_QUICK,
  NEW_DQUICK,
  WSTETH,
  FXCBETH,
  MATIC,
  EMPTY,
  OLD_QUICK,
  OLD_DQUICK,
  CXETH,
  VERSA,
  SAND,
  MAUSDC,
  FRAX,
  GHST,
  CRV,
  FBX,
  WEFI,
  DC,
  DD,
  dDD,
  frxETH,
  PUSH,
  LINK,
  AAVE,
  USDCE,
  fxMETOD,
  PKR,
  SLING,
  NINJAZ,
  RNDR,
  USDV,
  NFTE,
  CRS,
  EURO3,
} from './v3/addresses';
import { FeeAmount } from 'v3lib/utils';

export const bondAPIV2BaseURL = 'https://api-v2.apeswap.finance';
export const CEX_BILL_ADDRESS = '0x6D7637683eaD28F775F56506602191fdE417fF60';

export const AVERAGE_L1_BLOCK_TIME = 12000;

export const merklAMMs: { [chainId in ChainId]?: string[] } = {
  [ChainId.MATIC]: ['quickswapalgebra'],
  [ChainId.ZKEVM]: ['quickswapalgebra', 'quickswapuni'],
};

export const blackListMerklFarms = [
  '0x392DfB56cA9aA807571eC2a666c3bbf87c7FE63E',
  '0xAb86C5DD50F4e0B54ECb07c4fB07219c60150eBF',
  '0x19E4c89e983f5827e353ca0e8a0D6D26E703a8dF',
  '0x0Df98245e23e776Fe059F5793d03AC4221A0ef50',
];

export const subgraphNotReadyChains = [
  ChainId.ZKATANA,
  ChainId.X1,
  ChainId.ZKTESTNET,
  ChainId.MUMBAI,
  ChainId.DOEGCHAIN_TESTNET,
  ChainId.DOGECHAIN,
];

export const CHAIN_IDS_TO_NAMES = {
  [ChainId.MATIC]: 'matic',
  [ChainId.MUMBAI]: 'mumbai',
  [ChainId.DOGECHAIN]: 'dogechain',
  [ChainId.DOEGCHAIN_TESTNET]: 'dogechain_testnet',
  [ChainId.ZKEVM]: 'zkevm',
  [ChainId.ZKTESTNET]: 'zkevm_testnet',
  [ChainId.KAVA]: 'kava',
  [ChainId.MANTA]: 'manta',
  [ChainId.ZKATANA]: 'zKatana',
  [ChainId.BTTC]: 'bttc',
  [ChainId.TIMX]: 'tIMX',
  [ChainId.X1]: 'x1',
  [ChainId.IMX]: 'IMX',
  [ChainId.ASTARZKEVM]: 'astar_zkevm',
};

export enum ZapType {
  ZAP = 0,
  ZAP_LP_MIGRATOR = 1,
  ZAP_LP_POOL = 2,
  ZAP_SINGLE_ASSET_POOL = 3,
  ZAP_T_BILL = 4,
  ZAP_MINI_APE = 5,
}

export enum SteerVaultState {
  PendingApproval,
  PendingThreshold,
  Paused,
  Active,
  Retired,
}

export enum TxnType {
  SWAP,
  ADD,
  REMOVE,
}

export enum RouterTypes {
  QUICKSWAP = 'QUICKSWAP',
  SMART = 'SMART',
  BONUS = 'BONUS',
}

export enum SmartRouter {
  PARASWAP = 'PARASWAP',
  QUICKSWAP = 'QUICKSWAP',
}

export const WALLCHAIN_PARAMS: {
  [chainId in ChainId]?: {
    [SmartRouter.PARASWAP]: { apiURL: string; apiKey: string };
    [SmartRouter.QUICKSWAP]: { apiURL: string; apiKey: string };
  };
} = {
  [ChainId.MATIC]: {
    [SmartRouter.PARASWAP]: {
      apiURL: 'https://matic.wallchains.com/upgrade_txn/',
      apiKey: '91b92acd-e8fd-49c3-80fd-db2bc58bb8cf',
    },
    [SmartRouter.QUICKSWAP]: {
      apiURL: 'https://matic.wallchains.com/upgrade_txn/',
      apiKey: '50eaf751-196d-4fe0-9506-b983f7c83735',
    },
  },
};

export const BONUS_CUTOFF_AMOUNT: { [chainId in ChainId]?: number } = {
  [ChainId.MUMBAI]: 0,
  [ChainId.MATIC]: 0,
  [ChainId.DOEGCHAIN_TESTNET]: 0,
  [ChainId.DOGECHAIN]: 0,
  [ChainId.ZKTESTNET]: 0,
  [ChainId.ZKEVM]: 0,
  [ChainId.MANTA]: 0,
  [ChainId.KAVA]: 0,
  [ChainId.ZKATANA]: 0,
  [ChainId.BTTC]: 0,
  [ChainId.X1]: 0,
  [ChainId.TIMX]: 0,
  [ChainId.IMX]: 0,
};

export const MIN_NATIVE_CURRENCY_FOR_GAS: {
  [chainId in ChainId]: JSBI;
} = {
  [ChainId.MATIC]: JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)), // .01 ETH
  [ChainId.MUMBAI]: JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)),
  [ChainId.DOEGCHAIN_TESTNET]: JSBI.exponentiate(
    JSBI.BigInt(10),
    JSBI.BigInt(16),
  ),
  [ChainId.DOGECHAIN]: JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)),
  [ChainId.ZKEVM]: JSBI.multiply(
    JSBI.BigInt(3),
    JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(15)),
  ),
  [ChainId.ZKTESTNET]: JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(14)),
  [ChainId.MANTA]: JSBI.multiply(
    JSBI.BigInt(5),
    JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(14)),
  ),
  [ChainId.KAVA]: JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)),
  [ChainId.BTTC]: JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)),
  [ChainId.X1]: JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(15)),
  [ChainId.ZKATANA]: JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(14)),
  [ChainId.TIMX]: JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(14)),
  [ChainId.IMX]: JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(14)),
  [ChainId.ASTARZKEVM]: JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(14)),
};

export const GlobalConst = {
  blacklists: {
    TOKEN_BLACKLIST: [
      '0x495c7f3a713870f68f8b418b355c085dfdc412c3',
      '0xc3761eb917cd790b30dad99f6cc5b4ff93c4f9ea',
      '0xe31debd7abff90b06bca21010dd860d8701fd901',
      '0xfc989fbb6b3024de5ca0144dc23c18a063942ac1',
      '0xf4eda77f0b455a12f3eb44f8653835f377e36b76',
    ],
    PAIR_BLACKLIST: [
      '0xb6a741f37d6e455ebcc9f17e2c16d0586c3f57a5',
      '0x97cb8cbe91227ba87fc21aaf52c4212d245da3f8',
    ],
  },
  addresses: {
    ZERO_ADDRESS: '0x0000000000000000000000000000000000000000',
  },
  utils: {
    QUICK_CONVERSION_RATE: 1000,
    ONEDAYSECONDS: 60 * 60 * 24,
    DQUICKFEE: 0.04,
    DQUICKAPR_MULTIPLIER: 0.01,
    ROWSPERPAGE: 10,
    FEEPERCENT: 0.003,
    BUNDLE_ID: '1',
    PROPOSAL_LENGTH_IN_DAYS: 7, // TODO this is only approximate, it's actually based on blocks
    NetworkContextName: 'NETWORK',
    INITIAL_ALLOWED_SLIPPAGE: 50, // default allowed slippage, in bips
    DEFAULT_DEADLINE_FROM_NOW: 60 * 20, // 20 minutes, denominated in seconds
    BIG_INT_ZERO: JSBI.BigInt(0),
    ONE_BIPS: new Percent(JSBI.BigInt(1), JSBI.BigInt(10000)), // one basis point
    BIPS_BASE: JSBI.BigInt(10000),
    BETTER_TRADE_LINK_THRESHOLD: new Percent(
      JSBI.BigInt(75),
      JSBI.BigInt(10000),
    ),
    // the Uniswap Default token list lives here
    // we add '' to remove the possibility of nulls
    DEFAULT_ADS_LIST_URL: process.env.REACT_APP_ADS_LIST_DEFAULT_URL + '',
    DEFAULT_TOKEN_LIST_URL: process.env.REACT_APP_TOKEN_LIST_DEFAULT_URL + '',
    DEFAULT_LP_FARMS_LIST_URL:
      process.env.REACT_APP_STAKING_LIST_DEFAULT_URL + '',
    DEFAULT_CNT_FARMS_LIST_URL:
      process.env.REACT_APP_CNT_STAKING_LIST_DEFAULT_URL + '',
    DEFAULT_DUAL_FARMS_LIST_URL:
      process.env.REACT_APP_DUAL_STAKING_LIST_DEFAULT_URL + '',
    DEFAULT_SYRUP_LIST_URL: process.env.REACT_APP_SYRUP_LIST_DEFAULT_URL + '',
    ANALYTICS_TOKENS_COUNT: 200,
    ANALYTICS_PAIRS_COUNT: 400,
    v3FarmSortBy: {
      pool: '1',
      tvl: '2',
      rewards: '3',
      apr: '4',
    },
    v3FarmFilter: {
      allFarms: '0',
      stableCoin: '1',
      blueChip: '2',
      stableLP: '3',
      otherLP: '4',
    },
    poolsFilter: {
      quickswap: '0',
      unipilot: '1',
      gamma: '2',
      steer: '3',
      defiedge: '4',
      ichi: '5',
    },
  },
  analyticChart: {
    ONE_MONTH_CHART: 1,
    THREE_MONTH_CHART: 2,
    SIX_MONTH_CHART: 3,
    ONE_YEAR_CHART: 4,
    ALL_CHART: 5,
    CHART_COUNT: 60, //limit analytics chart items not more than 60
  },
  v2FarmTab: {
    LPFARM: 'lpFarm',
    DUALFARM: 'DualFarm',
    OTHER_LP: 'OtherFarm',
  },
  v3LiquidityRangeType: {
    MANUAL_RANGE: '0',
    GAMMA_RANGE: '1',
    UNIPILOT_RANGE: '2',
    DEFIEDGE_RANGE: '3',
    STEER_RANGE: '4',
  },
  walletName: {
    METAMASK: 'Metamask',
    TRUST_WALLET: 'TrustWallet',
    PHANTOM_WALLET: 'Phantom',
    CYPHERD: 'CypherD',
    BLOCKWALLET: 'BlockWallet',
    BRAVEWALLET: 'BraveWallet',
    BITGET: 'Bitget Wallet',
    INJECTED: 'Injected',
    SAFE_APP: 'Gnosis Safe App',
    ARKANE_CONNECT: 'Venly',
    Portis: 'Portis',
    WALLET_LINK: 'Coinbase Wallet',
    WALLET_CONNECT: 'WalletConnect',
    ZENGO_CONNECT: 'ZenGo',
    OKXWALLET: 'OKX Wallet',
    CRYPTOCOM: 'Crypto.com DeFi Wallet',
    UNSTOPPABLEDOMAINS: 'Unstoppable Domains',
    BINANCEWALLET: 'Binance Web3 Wallet',
    PASSPORTWALLET: 'Passport Wallet',
  },
};

export const SUPPORTED_CHAINIDS = [
  ChainId.MATIC,
  ChainId.ZKEVM,
  ChainId.MANTA,
  ChainId.IMX,
  ChainId.DOGECHAIN,
  ChainId.ASTARZKEVM,
  ChainId.ZKATANA,
  ChainId.X1,
  ChainId.TIMX,
  ChainId.ZKTESTNET,
  ChainId.MUMBAI,
  ChainId.DOEGCHAIN_TESTNET,
];

export const GlobalValue = {
  percents: {
    ALLOWED_PRICE_IMPACT_LOW: new Percent( // used for warning states
      JSBI.BigInt(100),
      GlobalConst.utils.BIPS_BASE,
    ), // 1%
    ALLOWED_PRICE_IMPACT_MEDIUM: new Percent(
      JSBI.BigInt(300),
      GlobalConst.utils.BIPS_BASE,
    ), // 3%
    ALLOWED_PRICE_IMPACT_HIGH: new Percent(
      JSBI.BigInt(500),
      GlobalConst.utils.BIPS_BASE,
    ), // 5%
    PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: new Percent( // if the price slippage exceeds this number, force the user to type 'confirm' to execute
      JSBI.BigInt(1000),
      GlobalConst.utils.BIPS_BASE,
    ), // 10%
    BLOCKED_PRICE_IMPACT_NON_EXPERT: new Percent( // for non expert mode disable swaps above this
      JSBI.BigInt(1500),
      GlobalConst.utils.BIPS_BASE,
    ), // 15%
  },
  tokens: {
    MATIC: WETH[ChainId.MATIC],
    COMMON: {
      [ChainId.MATIC]: [
        EMPTY[ChainId.MATIC],
        USDC[ChainId.MATIC],
        USDCE[ChainId.MATIC],
        USDT[ChainId.MATIC],
        OLD_QUICK[ChainId.MATIC],
        NEW_QUICK[ChainId.MATIC],
        OLD_DQUICK[ChainId.MATIC],
        NEW_DQUICK[ChainId.MATIC],
        WBTC[ChainId.MATIC],
        DAI[ChainId.MATIC],
        ETHER[ChainId.MATIC],
        MI[ChainId.MATIC],
        axlUSDC[ChainId.MATIC],
        TUSD[ChainId.MATIC],
        UND[ChainId.MATIC],
        USDD[ChainId.MATIC],
        CXETH[ChainId.MATIC],
        VERSA[ChainId.MATIC],
        SAND[ChainId.MATIC],
        MAUSDC[ChainId.MATIC],
        FRAX[ChainId.MATIC],
        GHST[ChainId.MATIC],
        MATICX[ChainId.MATIC],
        STMATIC[ChainId.MATIC],
        WSTETH[ChainId.MATIC],
        ANKRMATIC[ChainId.MATIC],
        CRV[ChainId.MATIC],
        DAVOS[ChainId.MATIC],
        FBX[ChainId.MATIC],
        FXCBETH[ChainId.MATIC],
        RMATIC[ChainId.MATIC],
        WEFI[ChainId.MATIC],
        PUSH[ChainId.MATIC],
        fxMETOD[ChainId.MATIC],
        PKR[ChainId.MATIC],
        SLING[ChainId.MATIC],
        NINJAZ[ChainId.MATIC],
        RNDR[ChainId.MATIC],
        NFTE[ChainId.MATIC],
        CRS[ChainId.MATIC],
      ],
      [ChainId.DOGECHAIN]: [
        EMPTY[ChainId.DOGECHAIN],
        USDC[ChainId.DOGECHAIN],
        USDT[ChainId.DOGECHAIN],
        WBTC[ChainId.DOGECHAIN],
        DAI[ChainId.DOGECHAIN],
        ETHER[ChainId.DOGECHAIN],
        MATIC[ChainId.DOGECHAIN],
        MI[ChainId.DOGECHAIN],
        DC[ChainId.DOGECHAIN],
        DD[ChainId.DOGECHAIN],
        dDD[ChainId.DOGECHAIN],
      ],
      [ChainId.ZKEVM]: [
        EMPTY[ChainId.ZKEVM],
        USDC[ChainId.ZKEVM],
        USDT[ChainId.ZKEVM],
        WBTC[ChainId.ZKEVM],
        DAI[ChainId.ZKEVM],
        MATIC[ChainId.ZKEVM],
        CRV[ChainId.ZKEVM],
        LINK[ChainId.ZKEVM],
        AAVE[ChainId.ZKEVM],
      ],
      [ChainId.MUMBAI]: [],
      [ChainId.DOEGCHAIN_TESTNET]: [],
      [ChainId.ZKTESTNET]: [],
      [ChainId.KAVA]: [],
      [ChainId.MANTA]: [EMPTY[ChainId.MANTA], MATICX[ChainId.MANTA]],
      [ChainId.ZKATANA]: [],
      [ChainId.BTTC]: [],
      [ChainId.X1]: [],
      [ChainId.TIMX]: [],
      [ChainId.IMX]: [],
      [ChainId.ASTARZKEVM]: [],
    },
  },
  marketSDK: {
    BLOCKSPERDAY: 0.5 * GlobalConst.utils.ONEDAYSECONDS,
  },
};

export const paraswapTaxBuy: { [key: string]: number } = {
  '0xed88227296943857409a8e0f15ad7134e70d0f73': 100,
  '0x37eb60f78e06c4bb2a5f836b0fc6bccbbaa995b3': 0,
  '0xf16ec50ec49abc95fa793c7871682833b6bc47e7': 1300,
  '0xfca466f2fa8e667a517c9c6cfa99cf985be5d9b1': 300,
  '0x74dd45dd579cad749f9381d6227e7e02277c944b': 300,
  '0x428360b02c1269bc1c79fbc399ad31d58c1e8fda': 200,
};

export const paraswapTaxSell: { [key: string]: number } = {
  '0xed88227296943857409a8e0f15ad7134e70d0f73': 100,
  '0x37eb60f78e06c4bb2a5f836b0fc6bccbbaa995b3': 0,
  '0xf16ec50ec49abc95fa793c7871682833b6bc47e7': 1300,
  '0xfca466f2fa8e667a517c9c6cfa99cf985be5d9b1': 300,
  '0x74dd45dd579cad749f9381d6227e7e02277c944b': 300,
  '0x428360b02c1269bc1c79fbc399ad31d58c1e8fda': 600,
};

export const GlobalData = {
  analytics: {
    CHART_DURATIONS: [
      GlobalConst.analyticChart.ONE_MONTH_CHART,
      GlobalConst.analyticChart.THREE_MONTH_CHART,
      GlobalConst.analyticChart.SIX_MONTH_CHART,
      GlobalConst.analyticChart.ONE_YEAR_CHART,
      GlobalConst.analyticChart.ALL_CHART,
    ],
    CHART_DURATION_TEXTS: ['1M', '3M', '6M', '1Y', 'All'],
  },
  stableCoins: {
    [ChainId.MATIC]: [
      USDC[ChainId.MATIC],
      USDCE[ChainId.MATIC],
      USDT[ChainId.MATIC],
      MI[ChainId.MATIC],
      DAI[ChainId.MATIC],
      axlUSDC[ChainId.MATIC],
      BOB[ChainId.MATIC],
      TUSD[ChainId.MATIC],
      UND[ChainId.MATIC],
      USDD[ChainId.MATIC],
      DAVOS[ChainId.MATIC],
      USDV[ChainId.MATIC],
      EURO3[ChainId.MATIC],
    ],
    [ChainId.MUMBAI]: [],
    [ChainId.DOGECHAIN]: [
      USDC[ChainId.DOGECHAIN],
      USDT[ChainId.DOGECHAIN],
      DAI[ChainId.ZKEVM],
      MI[ChainId.DOGECHAIN],
    ],
    [ChainId.DOEGCHAIN_TESTNET]: [],
    [ChainId.ZKEVM]: [
      USDC[ChainId.ZKEVM],
      DAI[ChainId.ZKEVM],
      USDT[ChainId.ZKEVM],
      FRAX[ChainId.ZKEVM],
    ],
    [ChainId.ZKTESTNET]: [],
    [ChainId.KAVA]: [],
    [ChainId.MANTA]: [
      USDC[ChainId.MANTA],
      USDT[ChainId.MANTA],
      DAI[ChainId.MANTA],
    ],
    [ChainId.ZKATANA]: [USDC[ChainId.ZKATANA]],
    [ChainId.TIMX]: [USDC[ChainId.TIMX]],
    [ChainId.BTTC]: [],
    [ChainId.X1]: [USDC[ChainId.X1]],
    [ChainId.IMX]: [USDC[ChainId.IMX], USDT[ChainId.IMX]],
    [ChainId.ASTARZKEVM]: [
      USDC[ChainId.ASTARZKEVM],
      USDT[ChainId.ASTARZKEVM],
      DAI[ChainId.ASTARZKEVM],
    ],
  },
  blueChips: {
    [ChainId.MATIC]: [
      WETH[ChainId.MATIC],
      ETHER[ChainId.MATIC],
      WBTC[ChainId.MATIC],
      USDC[ChainId.MATIC],
      USDCE[ChainId.MATIC],
      USDT[ChainId.MATIC],
      DAI[ChainId.MATIC],
    ],
    [ChainId.MUMBAI]: [],
    [ChainId.DOGECHAIN]: [
      WETH[ChainId.DOGECHAIN],
      ETHER[ChainId.DOGECHAIN],
      MATIC[ChainId.DOGECHAIN],
      USDC[ChainId.DOGECHAIN],
    ],
    [ChainId.DOEGCHAIN_TESTNET]: [],
    [ChainId.ZKEVM]: [
      WETH[ChainId.ZKEVM],
      MATIC[ChainId.ZKEVM],
      WBTC[ChainId.ZKEVM],
      USDC[ChainId.ZKEVM],
      USDT[ChainId.ZKEVM],
      DAI[ChainId.ZKEVM],
    ],
    [ChainId.ZKTESTNET]: [],
    [ChainId.KAVA]: [],
    [ChainId.MANTA]: [
      WETH[ChainId.MANTA],
      WBTC[ChainId.MANTA],
      USDC[ChainId.MANTA],
      USDT[ChainId.MANTA],
      DAI[ChainId.MANTA],
      MATIC[ChainId.MANTA],
    ],
    [ChainId.ZKATANA]: [WETH[ChainId.ZKATANA], USDC[ChainId.ZKATANA]],
    [ChainId.TIMX]: [WETH[ChainId.TIMX], USDC[ChainId.TIMX]],
    [ChainId.BTTC]: [],
    [ChainId.X1]: [WETH[ChainId.X1], USDC[ChainId.X1]],
    [ChainId.IMX]: [
      WETH[ChainId.IMX],
      USDC[ChainId.IMX],
      ETHER[ChainId.IMX],
      WBTC[ChainId.IMX],
      USDT[ChainId.IMX],
    ],
    [ChainId.ASTARZKEVM]: [
      WETH[ChainId.ASTARZKEVM],
      WBTC[ChainId.ASTARZKEVM],
      USDC[ChainId.ASTARZKEVM],
      USDT[ChainId.ASTARZKEVM],
      DAI[ChainId.ASTARZKEVM],
      MATIC[ChainId.ASTARZKEVM],
    ],
  },
  stablePairs: {
    [ChainId.MATIC]: [
      [
        GlobalValue.tokens.MATIC,
        MATICX[ChainId.MATIC],
        STMATIC[ChainId.MATIC],
        ANKRMATIC[ChainId.MATIC],
        RMATIC[ChainId.MATIC],
      ],
      [NEW_QUICK[ChainId.MATIC], NEW_DQUICK[ChainId.MATIC]],
      [ETHER[ChainId.MATIC], WSTETH[ChainId.MATIC], FXCBETH[ChainId.MATIC]],
    ],
    [ChainId.MUMBAI]: [],
    [ChainId.DOGECHAIN]: [],
    [ChainId.DOEGCHAIN_TESTNET]: [],
    [ChainId.ZKEVM]: [
      [MATIC[ChainId.ZKEVM], STMATIC[ChainId.ZKEVM]],
      [frxETH[ChainId.ZKEVM], WETH[ChainId.ZKEVM]],
    ],
    [ChainId.ZKTESTNET]: [],
    [ChainId.KAVA]: [],
    [ChainId.MANTA]: [
      [MATICX[ChainId.MANTA], MATIC[ChainId.MANTA]],
      [WETH[ChainId.MANTA], WSTETH[ChainId.MANTA]],
    ],
    [ChainId.ZKATANA]: [],
    [ChainId.TIMX]: [],
    [ChainId.BTTC]: [],
    [ChainId.X1]: [],
    [ChainId.IMX]: [],
    [ChainId.ASTARZKEVM]: [
      [WETH[ChainId.ASTARZKEVM], WSTETH[ChainId.ASTARZKEVM]],
    ],
  },
};

export const ContestPairs: any = {
  [ChainId.MATIC]: [
    {
      name: 'All',
      address: 'all',
    },
    {
      name: 'WETH / USDC',
      address: '0x55caabb0d2b704fd0ef8192a7e35d8837e678207',
      token0Address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
      token1Address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    },
    {
      name: 'WMATIC / USDC',
      address: '0xae81fac689a1b4b1e06e7ef4a2ab4cd8ac0a087d',
      token0Address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      token1Address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    },
    {
      name: 'WMATIC / USDT',
      address: '0x5b41eedcfc8e0ae47493d4945aa1ae4fe05430ff',
      token0Address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      token1Address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    },
    {
      name: 'WMATIC / WETH',
      address: '0x479e1b71a702a595e19b6d5932cd5c863ab57ee0',
      token0Address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      token1Address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    },
    {
      name: 'Past Winners',
      address: 'past-winners',
    },
  ],
  [ChainId.ZKEVM]: [
    {
      name: 'All',
      address: 'all',
    },
    {
      name: 'WETH_USDC',
      address: '0xc44ad482f24fd750caeba387d2726d8653f8c4bb',
      token0Address: '0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9',
      token1Address: '0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035',
    },
    {
      name: 'USDT_USDC',
      address: '0x9591b8a30c3a52256ea93e98da49ee43afa136a8',
      token0Address: '0x1e4a5963abfd975d8c9021ce480b42188849d41d',
      token1Address: '0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035',
    },
    {
      name: 'WMATIC_USDC',
      address: '0xc9853f9f29cdd15ece6965e20ca288a2946c15e6',
      token0Address: '0xa2036f0538221a77a3937f1379699f44945018d0',
      token1Address: '0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035',
    },
    {
      name: 'WMATIC_WETH',
      address: '0xb73abfb5a2c89f4038baa476ff3a7942a021c196',
      token0Address: '0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9',
      token1Address: '0xa2036f0538221a77a3937f1379699f44945018d0',
    },
  ],
  [ChainId.DOEGCHAIN_TESTNET]: [],
  [ChainId.DOGECHAIN]: [],
  [ChainId.ZKTESTNET]: [],
  [ChainId.MUMBAI]: [],
};

export const LeaderBoardAnalytics = {
  CHART_DURATIONS: [1, 7, 30],
  CHART_DURATION_TEXTS: ['24H', '7D', '30D'],
};

export const unipilotVaultTypes = ['Wide', 'Balanced', 'Narrow'];

export const BOND_QUERY_KEYS = {
  INDUSTRY_STATS: 'industryStats',
  HISTORICAL_INDUSTRY_STATS: 'historicalIndustryStats',
  LHD_PROFILES: 'lhdProfiles',
  LHD_PROFILE: 'lhdProfile',
  LHD_PASSWORD_VERIFIED: 'lhdPasswordVerified',
  HOMEPAGE_STATS: 'homepageStats',
  LIVE_AND_UPCOMING: 'liveAndUpcoming',
  TVL_STATS: 'tvlStats',
  WIDO_QUOTE: 'widoQuote',
  WIDO_ALLOWANCE: 'widoAllowance',
  WIDO_APPROVAL: 'widoApproval',
  WIDO_SIGN_APPROVAL: 'widoSignApproval',
  TOKEN_HISTORIC: 'tokenHistoric',
  BONDS_LANDING: 'bondsLanding',
  BOND_POST_REFERENCE: 'bondPostReference',
};

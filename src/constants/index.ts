import { ChainId, JSBI, Percent, Token, WETH } from '@uniswap/sdk';
import { AbstractConnector } from '@web3-react/abstract-connector';
import {
  injected,
  walletconnect,
  walletlink,
  portis,
  arkaneconnect,
  safeApp,
  trustconnect,
  unstopabbledomains,
  metamask,
  zengoconnect,
  phantomconnect,
} from '../connectors';
import MetamaskIcon from 'assets/images/metamask.png';
import BlockWalletIcon from 'assets/images/blockwalletIcon.svg';
import BraveWalletIcon from 'assets/images/braveWalletIcon.png';
import cypherDIcon from 'assets/images/cypherDIcon.png';
import BitKeepIcon from 'assets/images/bitkeep.png';
import CoinbaseWalletIcon from 'assets/images/coinbaseWalletIcon.svg';
import WalletConnectIcon from 'assets/images/walletConnectIcon.svg';
import PortisIcon from 'assets/images/portisIcon.png';
import PhantomIcon from 'assets/images/wallets/phantomIconPurple.svg';
import VenlyIcon from 'assets/images/venly.svg';
import GnosisIcon from 'assets/images/gnosis_safe.png';
import TrustIcon from 'assets/images/trust.png';
import ZengoIcon from 'assets/images/zengo.png';
import UnstoppableDomainsIcon from 'assets/images/unstoppableDomains.png';
import { NEW_QUICK_ADDRESS, QUICK_ADDRESS } from './v3/addresses';

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

export const WALLCHAIN_PARAMS = {
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
  [ChainId.MUMBAI]: {
    [SmartRouter.PARASWAP]: {
      apiURL: '',
      apiKey: '',
    },
    [SmartRouter.QUICKSWAP]: {
      apiURL: '',
      apiKey: '',
    },
  },
  [ChainId.DOEGCHAIN_TESTNET]: {
    [SmartRouter.PARASWAP]: {
      apiURL: '',
      apiKey: '',
    },
    [SmartRouter.QUICKSWAP]: {
      apiURL: '',
      apiKey: '',
    },
  },
  [ChainId.DOGECHAIN]: {
    [SmartRouter.PARASWAP]: {
      apiURL: '',
      apiKey: '',
    },
    [SmartRouter.QUICKSWAP]: {
      apiURL: '',
      apiKey: '',
    },
  },
  [ChainId.ZKTESTNET]: {
    [SmartRouter.PARASWAP]: {
      apiURL: '',
      apiKey: '',
    },
    [SmartRouter.QUICKSWAP]: {
      apiURL: '',
      apiKey: '',
    },
  },
  [ChainId.ZKEVM]: {
    [SmartRouter.PARASWAP]: {
      apiURL: '',
      apiKey: '',
    },
    [SmartRouter.QUICKSWAP]: {
      apiURL: '',
      apiKey: '',
    },
  },
};

export const BONUS_CUTOFF_AMOUNT = {
  [ChainId.MUMBAI]: 0,
  [ChainId.MATIC]: 0,
  [ChainId.DOEGCHAIN_TESTNET]: 0,
  [ChainId.DOGECHAIN]: 0,
  [ChainId.ZKTESTNET]: 0,
  [ChainId.ZKEVM]: 0,
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
    // used to ensure the user doesn't send so much ETH so they end up with <.01
    MIN_ETH: JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)), // .01 ETH
    BETTER_TRADE_LINK_THRESHOLD: new Percent(
      JSBI.BigInt(75),
      JSBI.BigInt(10000),
    ),
    DEFAULT_TOKEN_LIST_URL: process.env.REACT_APP_TOKEN_LIST_DEFAULT_URL + '',
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
  },
  walletName: {
    METAMASK: 'Metamask',
    TRUST_WALLET: 'Trust Wallet',
    PHANTOM_WALLET: 'Phantom',
    CYPHERD: 'CypherD',
    BLOCKWALLET: 'BlockWallet',
    BRAVEWALLET: 'BraveWallet',
    BITKEEP: 'BitKeep',
    INJECTED: 'Injected',
    SAFE_APP: 'Gnosis Safe App',
    ARKANE_CONNECT: 'Venly',
    Portis: 'Portis',
    WALLET_LINK: 'Coinbase Wallet',
    WALLET_CONNECT: 'WalletConnect',
    ZENGO_CONNECT: 'ZenGo',
  },
};

export const SUPPORTED_CHAINIDS = [
  ChainId.MATIC,
  ChainId.MUMBAI,
  ChainId.DOGECHAIN,
  ChainId.DOEGCHAIN_TESTNET,
  ChainId.ZKTESTNET,
  ChainId.ZKEVM,
];

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  CYPHERD: {
    connector: injected,
    name: GlobalConst.walletName.CYPHERD,
    iconName: cypherDIcon,
    description: 'CypherD browser extension.',
    href: null,
    color: '#E8831D',
  },
  METAMASK: {
    connector: metamask,
    name: GlobalConst.walletName.METAMASK,
    iconName: MetamaskIcon,
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
  },
  TRUST_WALLET: {
    connector: trustconnect,
    name: GlobalConst.walletName.TRUST_WALLET,
    iconName: TrustIcon,
    description: 'Trust wallet extension.',
    href: null,
    color: '#E8831D',
  },
  PHANTOM_WALLET: {
    connector: phantomconnect,
    name: GlobalConst.walletName.PHANTOM_WALLET,
    iconName: PhantomIcon,
    description: 'Phantom wallet extension.',
    href: null,
    color: '#E8831D',
  },
  BLOCKWALLET: {
    connector: injected,
    name: GlobalConst.walletName.BLOCKWALLET,
    iconName: BlockWalletIcon,
    description: 'BlockWallet browser extension.',
    href: null,
    color: '#1673ff',
  },
  BRAVEWALLET: {
    connector: injected,
    name: GlobalConst.walletName.BRAVEWALLET,
    iconName: BraveWalletIcon,
    description: 'Brave browser wallet.',
    href: null,
    color: '#1673ff',
    mobile: true,
  },
  BITKEEP: {
    connector: injected,
    name: GlobalConst.walletName.BITKEEP,
    iconName: BitKeepIcon,
    description: 'BitKeep browser extension.',
    href: null,
    color: '#E8831D',
  },
  INJECTED: {
    connector: injected,
    name: GlobalConst.walletName.INJECTED,
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true,
  },
  SAFE_APP: {
    connector: safeApp,
    name: GlobalConst.walletName.SAFE_APP,
    iconName: GnosisIcon,
    description: 'Login using gnosis safe app',
    href: null,
    color: '#4196FC',
    mobile: true,
  },
  WALLET_LINK: {
    connector: walletlink,
    name: GlobalConst.walletName.WALLET_LINK,
    iconName: CoinbaseWalletIcon,
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5',
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: GlobalConst.walletName.WALLET_CONNECT,
    iconName: WalletConnectIcon,
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true,
  },
  UNSTOPABBLEDOMAINS: {
    connector: unstopabbledomains,
    name: 'Unstoppable Domains',
    iconName: UnstoppableDomainsIcon,
    description: 'Unstoppable Domains',
    href: null,
    color: '#E8831D',
  },
  ZENGO_CONNECT: {
    connector: zengoconnect,
    name: GlobalConst.walletName.ZENGO_CONNECT,
    iconName: ZengoIcon,
    description: 'Connect to Zengo Wallet',
    href: null,
    color: '#4196FC',
    mobile: true,
  },
  ARKANE_CONNECT: {
    connector: arkaneconnect,
    name: GlobalConst.walletName.ARKANE_CONNECT,
    iconName: VenlyIcon,
    description: 'Login using Venly hosted wallet.',
    href: null,
    color: '#4196FC',
  },
  Portis: {
    connector: portis,
    name: GlobalConst.walletName.Portis,
    iconName: PortisIcon,
    description: 'Login using Portis hosted wallet',
    href: null,
    color: '#4A6C9B',
    mobile: true,
  },
};

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
      EMPTY: new Token(
        ChainId.MATIC,
        '0x0000000000000000000000000000000000000000',
        0,
        'EMPTY',
        'EMPTY',
      ),
      USDC: new Token(
        ChainId.MATIC,
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        6,
        'USDC',
        'USDC',
      ),
      USDT: new Token(
        ChainId.MATIC,
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        6,
        'USDT',
        'Tether USD',
      ),
      OLD_QUICK: new Token(
        ChainId.MATIC,
        QUICK_ADDRESS[ChainId.MATIC],
        18,
        'QUICK(OLD)',
        'Quickswap(OLD)',
      ),
      NEW_QUICK: new Token(
        ChainId.MATIC,
        NEW_QUICK_ADDRESS[ChainId.MATIC],
        18,
        'QUICK(NEW)',
        'QuickSwap(NEW)',
      ),
      OLD_DQUICK: new Token(
        ChainId.MATIC,
        '0xf28164A485B0B2C90639E47b0f377b4a438a16B1',
        18,
        'dQUICK',
        'Dragon QUICK',
      ),
      NEW_DQUICK: new Token(
        ChainId.MATIC,
        '0x958d208Cdf087843e9AD98d23823d32E17d723A1',
        18,
        'dQUICK',
        'Dragon QUICK',
      ),
      WBTC: new Token(
        ChainId.MATIC,
        '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
        8,
        'wBTC',
        'Wrapped Bitcoin',
      ),
      DAI: new Token(
        ChainId.MATIC,
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        18,
        'DAI',
        'Dai Stablecoin',
      ),
      ETHER: new Token(
        ChainId.MATIC,
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        18,
        'ETH',
        'Ether',
      ),
      CXETH: new Token(
        ChainId.MATIC,
        '0xfe4546feFe124F30788c4Cc1BB9AA6907A7987F9',
        18,
        'cxETH',
        'CelsiusX Wrapped ETH',
      ),
      MI: new Token(
        ChainId.MATIC,
        '0xa3Fa99A148fA48D14Ed51d610c367C61876997F1',
        18,
        'MAI',
        'miMATIC',
      ),
      VERSA: new Token(
        ChainId.MATIC,
        '0x8497842420cFdbc97896C2353D75d89Fc8D5Be5D',
        18,
        'VERSA',
        'VersaGames',
      ),
      SAND: new Token(
        ChainId.MATIC,
        '0xBbba073C31bF03b8ACf7c28EF0738DeCF3695683',
        18,
        'SAND',
        'SAND',
      ),
      MAUSDC: new Token(
        ChainId.MATIC,
        '0x9719d867A500Ef117cC201206B8ab51e794d3F82',
        6,
        'maUSDC',
        'Matic Aave interest bearing USDC',
      ),
      FRAX: new Token(
        ChainId.MATIC,
        '0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89',
        18,
        'FRAX',
        'FRAX',
      ),
      GHST: new Token(
        ChainId.MATIC,
        '0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7',
        18,
        'GHST',
        'Aavegotchi GHST Token',
      ),
      BOB: new Token(
        ChainId.MATIC,
        '0xB0B195aEFA3650A6908f15CdaC7D92F8a5791B0B',
        18,
        'BOB',
        'BOB',
      ),
      axlUSDC: new Token(
        ChainId.MATIC,
        '0x750e4C4984a9e0f12978eA6742Bc1c5D248f40ed',
        18,
        'axlUSDC',
        'Axelar Wrapped USDC',
      ),
      TUSD: new Token(
        ChainId.MATIC,
        '0x2e1AD108fF1D8C782fcBbB89AAd783aC49586756',
        18,
        'TUSD',
        'TrueUSD',
      ),
      UND: new Token(
        ChainId.MATIC,
        '0x1eBA4B44C4F8cc2695347C6a78F0B7a002d26413',
        18,
        'UND',
        'Unbound Dollar',
      ),
      USDD: new Token(
        ChainId.MATIC,
        '0xFFA4D863C96e743A2e1513824EA006B8D0353C57',
        18,
        'USDD',
        'Decentralized USD',
      ),
      MATICX: new Token(
        ChainId.MATIC,
        '0xfa68FB4628DFF1028CFEc22b4162FCcd0d45efb6',
        18,
        'MaticX',
        'Liquid Staking Matic',
      ),
      STMATIC: new Token(
        ChainId.MATIC,
        '0x3A58a54C066FdC0f2D55FC9C89F0415C92eBf3C4',
        18,
        'stMatic',
        'Staked MATIC',
      ),
      WSTETH: new Token(
        ChainId.MATIC,
        '0x03b54a6e9a984069379fae1a4fc4dbae93b3bccd',
        18,
        'wstETH',
        'Wrapped liquid staked Ether 2.0',
      ),
      ANKRMATIC: new Token(
        ChainId.MATIC,
        '0x0E9b89007eEE9c958c0EDA24eF70723C2C93dD58',
        18,
        'ankrMATIC',
        'Ankr Staked MATIC',
      ),
      CRV: new Token(
        ChainId.MATIC,
        '0x172370d5Cd63279eFa6d502DAB29171933a610AF',
        18,
        'CRV',
        'CRV (PoS)',
      ),
      DAVOS: new Token(
        ChainId.MATIC,
        '0xec38621e72d86775a89c7422746de1f52bba5320',
        18,
        'DAVOS',
        'Davos',
      ),
      FBX: new Token(
        ChainId.MATIC,
        '0xD125443F38A69d776177c2B9c041f462936F8218',
        18,
        'FBX',
        'FireBotToken',
      ),
    },
  },
};

export const paraswapTax: { [key: string]: number } = {
  '0xed88227296943857409a8e0f15ad7134e70d0f73': 100,
  '0x37eb60f78e06c4bb2a5f836b0fc6bccbbaa995b3': 0,
  '0xf16ec50ec49abc95fa793c7871682833b6bc47e7': 1300,
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
  stableCoins: [
    GlobalValue.tokens.COMMON.USDC,
    GlobalValue.tokens.COMMON.USDT,
    GlobalValue.tokens.COMMON.MI,
    GlobalValue.tokens.COMMON.DAI,
    GlobalValue.tokens.COMMON.axlUSDC,
    GlobalValue.tokens.COMMON.BOB,
    GlobalValue.tokens.COMMON.TUSD,
    GlobalValue.tokens.COMMON.UND,
    GlobalValue.tokens.COMMON.USDD,
    GlobalValue.tokens.COMMON.DAVOS,
  ],
  blueChips: [
    WETH[ChainId.MATIC],
    GlobalValue.tokens.COMMON.ETHER,
    GlobalValue.tokens.COMMON.WBTC,
    GlobalValue.tokens.COMMON.USDC,
    GlobalValue.tokens.COMMON.USDT,
    GlobalValue.tokens.COMMON.DAI,
  ],
  stablePairs: [
    [
      GlobalValue.tokens.MATIC,
      GlobalValue.tokens.COMMON.MATICX,
      GlobalValue.tokens.COMMON.STMATIC,
      GlobalValue.tokens.COMMON.ANKRMATIC,
    ],
    [GlobalValue.tokens.COMMON.NEW_QUICK, GlobalValue.tokens.COMMON.NEW_DQUICK],
    [GlobalValue.tokens.COMMON.ETHER, GlobalValue.tokens.COMMON.WSTETH],
  ],
};

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[];
};

export interface WalletInfo {
  connector?: AbstractConnector;
  name: string;
  iconName: string;
  description: string;
  href: string | null;
  color: string;
  primary?: true;
  mobile?: true;
  mobileOnly?: true;
  installLink?: string | null;
}

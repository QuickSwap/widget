import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, useMediaQuery } from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';
import { useTheme } from '@material-ui/core/styles';
import { useUDDomain, useWalletModalToggle } from 'state/application/hooks';
import {
  isTransactionRecent,
  useAllTransactions,
} from 'state/transactions/hooks';
import { TransactionDetails } from 'state/transactions/reducer';
import { shortenAddress, isSupportedNetwork } from 'utils';
import useENSName from 'hooks/useENSName';
import { WalletModal, NetworkSelectionModal } from 'components';
import { useActiveWeb3React } from 'hooks';
import QuickIcon from 'assets/images/quickIcon.svg';
import QuickLogo from 'assets/images/quickLogo.png';
import WalletIcon from 'assets/images/WalletIcon.png';
import 'components/styles/Header.scss';
import { useTranslation } from 'react-i18next';
import { getConfig } from 'config';

const newTransactionsFirst = (a: TransactionDetails, b: TransactionDetails) => {
  return b.addedTime - a.addedTime;
};

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { account } = useActiveWeb3React();
  const { ethereum } = window as any;
  const { ENSName } = useENSName(account ?? undefined);
  const { udDomain } = useUDDomain();
  const [openNetworkSelectionModal, setOpenNetworkSelectionModal] = useState(
    false,
  );
  const theme = useTheme();
  const allTransactions = useAllTransactions();
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions
    .filter((tx: any) => !tx.receipt)
    .map((tx: any) => tx.hash);
  const confirmed = sortedRecentTransactions
    .filter((tx: any) => tx.receipt)
    .map((tx: any) => tx.hash);
  const mobileWindowSize = useMediaQuery(theme.breakpoints.down('xs'));
  const toggleWalletModal = useWalletModalToggle();

  const { chainId } = useActiveWeb3React();
  const config = getConfig(chainId);

  return (
    <Box className='header'>
      <NetworkSelectionModal
        open={openNetworkSelectionModal}
        onClose={() => setOpenNetworkSelectionModal(false)}
      />
      <WalletModal
        ENSName={ENSName ?? undefined}
        pendingTransactions={pending}
        confirmedTransactions={confirmed}
      />
      <Link to='/'>
        <img
          src={mobileWindowSize ? QuickIcon : QuickLogo}
          alt='QuickLogo'
          height={mobileWindowSize ? 40 : 60}
        />
      </Link>
      <Box>
        <Box
          className='networkSelection'
          onClick={() => setOpenNetworkSelectionModal(true)}
        >
          {(!ethereum || isSupportedNetwork(ethereum)) && (
            <Box className='networkSelectionImage'>
              <Box className='styledPollingDot' />
              <img src={config['nativeCurrencyImage']} alt='network Image' />
            </Box>
          )}
          <small className='weight-600'>
            {ethereum && !isSupportedNetwork(ethereum)
              ? t('wrongNetwork')
              : config['networkName']}
          </small>
          <KeyboardArrowDown />
        </Box>
        {account && (!ethereum || isSupportedNetwork(ethereum)) ? (
          <Box
            id='web3-status-connected'
            className='accountDetails'
            onClick={toggleWalletModal}
          >
            <p>{udDomain ?? shortenAddress(account)}</p>
            <img src={WalletIcon} alt='Wallet' />
          </Box>
        ) : !ethereum || isSupportedNetwork(ethereum) ? (
          <Box
            className='connectButton bg-primary'
            onClick={() => {
              toggleWalletModal();
            }}
          >
            {t('connectWallet')}
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};

export default Header;

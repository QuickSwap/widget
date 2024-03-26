import { Box } from '@material-ui/core';
import { SettingsModal, WalletModal } from 'components';
import React, { useMemo, useState } from 'react';
import { SlippageWrapper } from './SlippageWrapper';
import { ReactComponent as SettingsIcon } from 'assets/images/SettingsIcon.svg';
import useENSName from 'hooks/useENSName';
import { useActiveWeb3React } from 'hooks';
import {
  isTransactionRecent,
  useAllTransactions,
} from 'state/transactions/hooks';
import { TransactionDetails } from 'state/transactions/reducer';
import { NetworkSelection } from './NetworkSelection';

const newTransactionsFirst = (a: TransactionDetails, b: TransactionDetails) => {
  return b.addedTime - a.addedTime;
};

const SwapPageHeader: React.FC = () => {
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const { account } = useActiveWeb3React();
  const { ENSName } = useENSName(account ?? undefined);
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

  return (
    <>
      {openSettingsModal && (
        <SettingsModal
          open={openSettingsModal}
          onClose={() => setOpenSettingsModal(false)}
        />
      )}
      <Box className='flex items-center justify-end'>
        <NetworkSelection />
        <SlippageWrapper />
        <SettingsIcon
          className='cursor-pointer'
          onClick={() => setOpenSettingsModal(true)}
        />
      </Box>
      <WalletModal
        ENSName={ENSName ?? undefined}
        pendingTransactions={pending}
        confirmedTransactions={confirmed}
      />
    </>
  );
};

export default SwapPageHeader;

import { Box } from '@material-ui/core';
import { SettingsModal } from 'components';
import 'pages/styles/swap.scss';
import React, { useState } from 'react';
import SwapMain from './SwapMain';

const SwapPage: React.FC = () => {
  const [openSettingsModal, setOpenSettingsModal] = useState(false);

  return (
    <Box width='100%' mb={3}>
      {openSettingsModal && (
        <SettingsModal
          open={openSettingsModal}
          onClose={() => setOpenSettingsModal(false)}
        />
      )}
      <SwapMain />
    </Box>
  );
};

export default SwapPage;

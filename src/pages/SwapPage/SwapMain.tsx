import { Box, Button, Menu, MenuItem } from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';
import { ReactComponent as SettingsIcon } from 'assets/images/SettingsIcon.svg';
import { SettingsModal, Swap } from 'components';
import { SwapBestTrade } from 'components/Swap';
import useParsedQueryString from 'hooks/useParsedQueryString';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useIsV2 } from 'state/application/hooks';
import SwapLimitOrder from './SwapLimitOrder';
import SwapV3Page from './V3/Swap';

const SWAP_BEST_TRADE = 0;
const SWAP_NORMAL = 1;
const SWAP_V3 = 2;
const SWAP_LIMIT = 3;
const SWAP_CROSS_CHAIN = 4;

const SwapDropdownTabs = [
  { name: 'bestTrade', key: SWAP_BEST_TRADE },
  { name: 'market', key: SWAP_NORMAL },
  { name: 'marketV3', key: SWAP_V3 },
  { name: 'limit', key: SWAP_LIMIT },
];

const SwapMain: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const parsedQs = useParsedQueryString();
  const swapType = parsedQs.swapIndex;
  const history = useHistory();
  const [openSettingsModal, setOpenSettingsModal] = useState(false);

  const { updateIsV2 } = useIsV2();
  const params: any = useParams();
  const isOnV3 = params ? params.version === 'v3' : false;
  const isOnV2 = params ? params.version === 'v2' : false;

  const { t } = useTranslation();

  const [dropDownMenuText, setDropdownMenuText] = useState(() => {
    const currentTab = parseInt(swapType?.toString() || '0', 0);
    if (currentTab == SWAP_CROSS_CHAIN) {
      return SwapDropdownTabs[0].name;
    } else {
      return SwapDropdownTabs[currentTab].name;
    }
  });

  const [selectedIndex, setSelectedIndex] = React.useState(
    parseInt(swapType?.toString() || '0', 0),
  );

  const redirectWithSwapType = (swapTypeTo: number) => {
    const currentPath = history.location.pathname + history.location.search;
    let redirectPath = '';
    if (swapType) {
      redirectPath = currentPath.replace(
        `swapIndex=${swapType}`,
        `swapIndex=${swapTypeTo}`,
      );
    } else {
      redirectPath = `${currentPath}${
        Object.values(parsedQs).length > 0 ? '&' : '?'
      }swapIndex=${swapTypeTo}`;
    }
    history.push(redirectPath);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setAnchorEl(null);
    setDropdownMenuText(SwapDropdownTabs[index].name);
    redirectWithSwapType(SwapDropdownTabs[index].key);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    updateIsV2(!isOnV2 && !isOnV3 ? true : isOnV2);
    if (!swapType) {
      if (!isOnV3 && isOnV2) {
        redirectWithSwapType(SWAP_NORMAL);
      } else {
        redirectWithSwapType(SWAP_BEST_TRADE);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnV3, isOnV2, swapType]);

  useEffect(() => {
    if (swapType) {
      if (swapType === SWAP_V3.toString()) {
        updateIsV2(false);
      } else {
        updateIsV2(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapType]);

  return (
    <>
      {openSettingsModal && (
        <SettingsModal
          open={openSettingsModal}
          onClose={() => setOpenSettingsModal(false)}
        />
      )}
      <Box className='flex flex-wrap items-center justify-between'>
        <Box display='flex' width={1}>
          <Button
            id='swap-button'
            aria-controls={open ? 'swap-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            variant='text'
            style={{ background: 'transparent' }}
            disableElevation
            onClick={handleClickListItem}
            endIcon={<KeyboardArrowDown />}
          >
            {t(dropDownMenuText)}
          </Button>
          <Menu
            id='swap-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'swap-button',
              role: 'listbox',
            }}
          >
            {SwapDropdownTabs.map((option, index) => (
              <MenuItem
                key={option.key}
                disabled={option.key === selectedIndex}
                selected={option.key === selectedIndex}
                onClick={(event) => handleMenuItemClick(event, option.key)}
              >
                {t(option.name)}
              </MenuItem>
            ))}
          </Menu>

          <Box
            style={{
              marginLeft: 'auto',
              marginTop: 'auto',
              marginBottom: 'auto',
            }}
          >
            <Box margin='0 16px' className='flex items-center headingItem'>
              <SettingsIcon onClick={() => setOpenSettingsModal(true)} />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box pt={3.5}>
        {swapType === SWAP_BEST_TRADE.toString() && <SwapBestTrade />}
        {swapType === SWAP_NORMAL.toString() && <Swap />}
        {swapType === SWAP_V3.toString() && <SwapV3Page />}
        {swapType === SWAP_LIMIT.toString() && <SwapLimitOrder />}
      </Box>
    </>
  );
};

export default SwapMain;

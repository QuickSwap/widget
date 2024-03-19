import React from 'react';
import { Box } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { WalletOptionProps } from './WalletOptionProps';

const BarOptionContent: React.FC<WalletOptionProps> = ({
  onClick,
  header,
  subheader = null,
  icon,
  active = false,
  id,
  installLink = null,
}) => {
  const { t } = useTranslation();
  return (
    <Box className='optionCardClickable' id={id} onClick={onClick}>
      <Box className='flex items-center' my={0.5}>
        <img src={icon} alt={'Icon'} width={24} />
        <p style={{ marginLeft: 8 }}>{header}</p>
      </Box>
      {active && (
        <Box className='flex items-center'>
          <Box className='optionConnectedDot' />
          <small>{t('connected')}</small>
        </Box>
      )}
      {!active && installLink && (
        <Box className='flex items-center'>
          <small className='installBtn'>{t('install')}</small>
        </Box>
      )}
      {subheader && (
        <Box my={0.5} width={1}>
          <span>{subheader}</span>
        </Box>
      )}
    </Box>
  );
};

export default BarOptionContent;

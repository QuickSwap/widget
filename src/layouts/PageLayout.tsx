import React from 'react';
import { Box } from '@material-ui/core';
import { Footer } from 'components';

export interface PageLayoutProps {
  children: any;
  name?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, name }) => {
  return (
    <Box className='page'>
      <Box>{children}</Box>
      <Footer />
    </Box>
  );
};

export default PageLayout;

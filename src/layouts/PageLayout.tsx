import React, { lazy } from 'react';
import { Box } from '@material-ui/core';
const Footer = lazy(() => import('components/Footer'));

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

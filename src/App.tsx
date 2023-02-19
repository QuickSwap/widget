import React, { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';
import { Switch, Route } from 'react-router-dom';
import {
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
} from '@material-ui/core';
import { Provider } from 'react-redux';
import store from 'state';
import GoogleAnalyticsReporter from './components/GoogleAnalytics/GoogleAnalyticsReporter';
const SwapPage = lazy(() => import('./pages/SwapPage'));

import { PageLayout } from 'layouts';
import { getLibrary } from 'utils';
import StyledThemeProvider from 'theme/index';
import { Web3ReactManager, Popups } from 'components';
import { GlobalConst } from 'constants/index';
import ApplicationUpdater from 'state/application/updater';
import TransactionUpdater from 'state/transactions/updater';
import ListsUpdater from 'state/lists/updater';
import UserUpdater from 'state/user/updater';
import MulticallUpdater from 'state/multicall/updater';
import MultiCallV3Updater from 'state/multicall/v3/updater';
import './i18n';
import { mainTheme } from './theme';
import Background from 'layouts/Background';
import GasUpdater from 'state/application/gasUpdater';

const Web3ProviderNetwork = createWeb3ReactRoot(
  GlobalConst.utils.NetworkContextName,
);

const ThemeProvider: React.FC = ({ children }) => {
  const theme = mainTheme;

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

const Providers: React.FC = ({ children }) => {
  return (
    <Suspense fallback={<Background fallback={true} />}>
      <ThemeProvider>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Suspense>
  );
};

function Updaters() {
  return (
    <>
      <ApplicationUpdater />
      <TransactionUpdater />
      <ListsUpdater />
      <MulticallUpdater />
      <MultiCallV3Updater />
      <UserUpdater />
      <GasUpdater />
    </>
  );
}

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Route component={GoogleAnalyticsReporter} />
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <Provider store={store}>
            <Updaters />
            <Providers>
              <Popups />
              <StyledThemeProvider>
                <Web3ReactManager>
                  <Switch>
                    <Route exact path='/'>
                      <PageLayout>
                        <SwapPage />
                      </PageLayout>
                    </Route>
                  </Switch>
                </Web3ReactManager>
              </StyledThemeProvider>
            </Providers>
          </Provider>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </QueryClientProvider>
  );
};

export default App;

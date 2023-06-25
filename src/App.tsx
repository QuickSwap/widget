import React, { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
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
import { Web3ReactManager, Popups } from 'components';
import ApplicationUpdater from 'state/application/updater';
import TransactionUpdater from 'state/transactions/updater';
import ListsUpdater from 'state/lists/updater';
import UserUpdater from 'state/user/updater';
import MulticallUpdater from 'state/multicall/updater';
import MultiCallV3Updater from 'state/multicall/v3/updater';
import './i18n';
import { mainTheme } from './theme';

const ThemeProvider: React.FC = ({ children }) => {
  const theme = mainTheme;

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

const Providers: React.FC = ({ children }) => {
  return (
    <Suspense fallback={<div />}>
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
    </>
  );
}

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Route component={GoogleAnalyticsReporter} />
      <Provider store={store}>
        <Providers>
          <Web3ReactManager>
            <Updaters />
            <Popups />
            <Switch>
              <Route exact path='/'>
                <PageLayout>
                  <SwapPage />
                </PageLayout>
              </Route>
            </Switch>
          </Web3ReactManager>
        </Providers>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;

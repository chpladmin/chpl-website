import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useIsFetching,
} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import {
  CircularProgress,
  makeStyles,
} from '@material-ui/core';
import { element } from 'prop-types';

import { AxiosProvider } from './axios';

const queryClient = new QueryClient();

const useStyles = makeStyles({
  container: {
    top: '50%',
    left: '50%',
    position: 'fixed',
  },
});

function GlobalLoadingIndicator() {
  const isFetching = useIsFetching();
  const classes = useStyles();

  return isFetching ? (
    <div className={classes.container}><CircularProgress /></div>
  ) : null;
}

function ApiWrapper({ children }) {
  return (
    <AxiosProvider>
      <QueryClientProvider client={queryClient}>
        <GlobalLoadingIndicator />
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AxiosProvider>
  );
}

export default ApiWrapper;

ApiWrapper.propTypes = {
  children: element.isRequired,
};

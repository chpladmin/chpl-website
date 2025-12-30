/* global DEVELOPER_MODE */

import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { bool, element } from 'prop-types';

import { AxiosProvider } from './axios';

const queryClient = new QueryClient();

function ApiWrapper({ children, showQueryTools = DEVELOPER_MODE }) {
  return (
    <AxiosProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        { showQueryTools
          && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
      </QueryClientProvider>
    </AxiosProvider>
  );
}

export default ApiWrapper;

ApiWrapper.propTypes = {
  children: element.isRequired,
  showQueryTools: bool,
};

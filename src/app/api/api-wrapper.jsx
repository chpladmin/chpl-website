import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { bool, element } from 'prop-types';

import { AxiosProvider } from './axios';

const queryClient = new QueryClient();

function ApiWrapper({ children, showQueryTools }) {
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

ApiWrapper.defaultProps = {
  showQueryTools: false,
};

import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { AxiosProvider } from 'api/axios';
import AppWrapper from 'app-wrapper';
import ChplAnnouncementsFab from './announcements-fab';

const queryClient = new QueryClient();

function ChplAnnouncementsFabWrapper() {
  return (
    <AppWrapper>
      <AxiosProvider>
        <QueryClientProvider client={queryClient}>
          <ChplAnnouncementsFab />
        </QueryClientProvider>
      </AxiosProvider>
    </AppWrapper>
  );
}

export default ChplAnnouncementsFabWrapper;

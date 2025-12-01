import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { AxiosProvider } from 'api/axios';
import ChplAnnouncementsFab from './announcements-fab';

const queryClient = new QueryClient();

function ChplAnnouncementsFabWrapper() {
  return (
    <AxiosProvider>
      <QueryClientProvider client={queryClient}>
        <ChplAnnouncementsFab />
      </QueryClientProvider>
    </AxiosProvider>
  );
}

export default ChplAnnouncementsFabWrapper;

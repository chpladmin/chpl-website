import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import ChplAnnouncementsDisplay from './announcements-display';

const mockApi = {
  isLoading: false,
  isSuccess: true,
  data: [{
    id: 1,
    title: 'a title',
    text: 'some text',
  }, {
    id: 2,
    title: 'second title',
  }],
};

jest.mock('api/announcements', () => ({
  __esModule: true,
  useFetchAnnouncements: () => mockApi,
}));

describe('the ChplAnnouncementsDisplay component', () => {
  afterEach(() => {
    cleanup();
  });

  describe('when there are announcements', () => {
    beforeEach(async () => {
      render(
        <ChplAnnouncementsDisplay />,
      );
    });

    it('should display those announcements', async () => {
      await waitFor(() => {
        expect(screen.queryByText(/^a title: some text$/)).toBeInTheDocument();
        expect(screen.queryByText(/^second title$/)).toBeInTheDocument();
      });
    });
  });
});

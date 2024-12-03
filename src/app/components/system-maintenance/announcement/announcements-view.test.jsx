import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import ChplAnnouncementsView from './announcements-view';

const mock = {
  hoc: {
    dispatch: jest.fn(),
  },
  announcement: {
    title: 'a title',
    text: 'some text',
    startDateTime: '2022-01-01T12:13:14',
    endDateTime: '2022-03-04T12:13:14',
    isPublic: false,
  },
};

xdescribe('the ChplAnnouncementsView component', () => {
  afterEach(() => {
    cleanup();
  });

  describe('when there are no announcements', () => {
    beforeEach(async () => {
      render(
        <ChplAnnouncementsView
          announcements={[]}
          dispatch={mock.hoc.dispatch}
        />,
      );
    });

    it('should indicate no announcements are around', async () => {
      await waitFor(() => {
        expect(screen.queryByText('No results found')).toBeInTheDocument();
      });
    });
  });
});

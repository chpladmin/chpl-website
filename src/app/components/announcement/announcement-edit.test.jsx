import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import ChplAnnouncementEdit from './announcement-edit';

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

describe('the ChplAnnouncementEdit component', () => {
  afterEach(() => {
    cleanup();
  });

  describe('when creating an announcement', () => {
    beforeEach(async () => {
      render(
        <ChplAnnouncementEdit
          announcement={{}}
          dispatch={mock.hoc.dispatch}
        />,
      );
    });

    describe('when acting from the action bar', () => {
      it('should allow cancellation', async () => {
        userEvent.click(screen.getByRole('button', { name: /Cancel/i }));
        userEvent.click(screen.getByRole('button', { name: /Yes/i }));

        await waitFor(() => {
          expect(mock.hoc.dispatch).toHaveBeenCalledWith('close');
        });
      });

      it('should give errors about required elements', async () => {
        userEvent.click(screen.getByRole('button', { name: /Save/i }));

        await waitFor(() => {
          expect(screen.queryByText('Field is required')).toBeInTheDocument();
        });
      });

      it('should not allow the end date to be before the start date', async () => {
        userEvent.type(screen.getByLabelText(/Start Date/i), '2024-03-15');
        userEvent.type(screen.getByLabelText(/End Date/i), '2020-03-16');
        userEvent.click(screen.getByRole('button', { name: /Save/i }));

        await waitFor(() => {
          expect(screen.queryByText('End Date must be after Start Date')).toBeInTheDocument();
        });
      });
    });
  });
});

import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import ChplActionBarConfirmation from './action-bar-confirmation';

const hocMock = {
  dispatch: jest.fn(),
};

describe('the ChplActionBarConfirmation component', () => {
  beforeEach(async () => {
    render(
      <ChplActionBarConfirmation
        dispatch={hocMock.dispatch}
        pendingMessage="This is your message"
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  describe('when taking actions', () => {
    it('should call the callback for "No"', async () => {
      hocMock.dispatch.mockClear();
      userEvent.click(screen.getByRole('button', { name: /No/i }));

      await waitFor(() => {
        expect(hocMock.dispatch).toHaveBeenCalledWith('no');
      });
    });

    it('should call the callback for "Yes"', async () => {
      hocMock.dispatch.mockClear();
      userEvent.click(screen.getByRole('button', { name: /Yes/i }));

      await waitFor(() => {
        expect(hocMock.dispatch).toHaveBeenCalledWith('yes');
      });
    });
  });
});

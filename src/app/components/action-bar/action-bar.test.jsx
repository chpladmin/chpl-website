import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import ChplActionBar from './action-bar';

const hocMock = {
  dispatch: jest.fn(),
};

describe('the ChplActionBar component', () => {
  beforeEach(async () => {
    render(
      <ChplActionBar
        dispatch={hocMock.dispatch}
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  describe('when taking actions', () => {
    it('should call the callback for cancel', async () => {
      hocMock.dispatch.mockClear();
      userEvent.click(screen.getByRole('button', { name: /Cancel/i }));
      userEvent.click(screen.getByRole('button', { name: /Yes/i }));

      await waitFor(() => {
        expect(hocMock.dispatch).toHaveBeenCalledWith('cancel');
      });
    });

    it('should call the callback for save', async () => {
      hocMock.dispatch.mockClear();
      userEvent.click(screen.getByRole('button', { name: /Save/i }));

      await waitFor(() => {
        expect(hocMock.dispatch).toHaveBeenCalledWith('save');
      });
    });
  });
});

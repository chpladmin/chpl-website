import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import ChplComplaintAdd from './complaint-add';

const mock = {
  hoc: {
    dispatch: jest.fn(),
  },
};

describe('the ChplComplaintAdd component', () => {
  afterEach(() => {
    cleanup();
  });

  describe('when adding a complaint', () => {
    beforeEach(async () => {
      render(
        <ChplComplaintAdd
          dispatch={mock.hoc.dispatch}
        />,
      );
    });

    it('should call the hoc', async () => {
      userEvent.click(screen.getByRole('button', { name: /Add New Complaint/i }));

      await waitFor(() => {
        expect(mock.hoc.dispatch).toHaveBeenCalledWith('add');
      });
    });
  });
});

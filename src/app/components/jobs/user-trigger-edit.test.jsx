import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import ChplUserTriggerEdit from './user-trigger-edit';

const hocMock = {
  dispatch: jest.fn(),
};

const acbsMock = [];

const triggerMock = {
  job: {
    name: 'job name',
    description: 'job description',
    jobDataMap: {},
  },
};

describe('the ChplUserTriggerEdit component', () => {
  beforeEach(async () => {
    render(
      <ChplUserTriggerEdit
        acbs={acbsMock}
        trigger={triggerMock}
        dispatch={hocMock.dispatch}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText('0 0 4 1/1 * ? *')).toBeInTheDocument();
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('should have a header', async () => {
    expect(screen.getByText('Schedule Report: job name')).toBeInTheDocument();
  });

  describe('when interacting with a job', () => {
    it('should call the callback to close', async () => {
      userEvent.click(screen.getByRole('button', { name: /Cancel/i }));
      userEvent.click(screen.getByRole('button', { name: /Yes/i }));

      await waitFor(() => {
        expect(hocMock.dispatch).toHaveBeenCalledWith({ action: 'close' });
      });
    });
  });
});

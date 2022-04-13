import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import ChplEditableJobEdit from './editable-job-edit';

const hocMock = {
  dispatch: jest.fn(),
};

const jobMock = {
  name: 'job name',
  description: 'job description',
  jobDataMap: { email: 'fake@example.com' },
};

describe('the ChplEditableJobEdit component', () => {
  beforeEach(async () => {
    render(
      <ChplEditableJobEdit
        job={jobMock}
        dispatch={hocMock.dispatch}
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('should have a header', async () => {
    expect(screen.getByText('Edit Job: job name')).toBeInTheDocument();
  });

  describe('when interacting with a job', () => {
    it('should call the callback to close', async () => {
      userEvent.click(screen.getByRole('button', { name: /Cancel/i }));
      userEvent.click(screen.getByRole('button', { name: /Yes/i }));

      await waitFor(() => {
        expect(hocMock.dispatch).toHaveBeenCalledWith({ action: 'close' });
      });
    });

    it('should call the callback to schedule a job', async () => {
      userEvent.click(screen.getByRole('button', { name: /Save/i }));

      await waitFor(() => {
        expect(hocMock.dispatch).toHaveBeenCalledWith({
          action: 'save',
          payload: expect.objectContaining(jobMock),
        });
      });
    });
  });
});

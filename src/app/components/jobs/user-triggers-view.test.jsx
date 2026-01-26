import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import ChplUserTriggersView from './user-triggers-view';

const hocMock = {
  dispatch: jest.fn(),
};

const acbsMock = [];

const triggersMock = [{
  name: 'job name',
  email: 'name@example.com',
  cronSchedule: 'cron s',
  job: { name: 'job name' },
}];

describe('the ChplUserTriggersView component', () => {
  beforeEach(async () => {
    render(
      <ChplUserTriggersView
        acbs={acbsMock}
        triggers={triggersMock}
        dispatch={hocMock.dispatch}
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('should display jobs in card view', async () => {
    await waitFor(() => {
      expect(screen.getByText('Scheduled Reports:')).toBeInTheDocument();
      expect(screen.getByText('job name')).toBeInTheDocument();
      expect(screen.getByText('name@example.com')).toBeInTheDocument();
    });
  });

  describe('when interacting with a job', () => {
    it('should call the callback to edit a job', async () => {
      userEvent.click(screen.getByRole('button', { name: /Edit Report job name/i }));

      await waitFor(() => {
        expect(hocMock.dispatch).toHaveBeenCalledWith({ action: 'edit', payload: expect.objectContaining(triggersMock[0]) });
      });
    });
  });
});

import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import ChplSystemJobTypesView from './system-job-types-view';

const hocMock = {
  dispatch: jest.fn(),
};

const jobTypesMock = [{
  name: 'test name',
  description: 'test description',
  group: 'systemJobs',
  jobDataMap: {},
}];

describe('the ChplSystemJobTypesView component', () => {
  beforeEach(async () => {
    render(
      <ChplSystemJobTypesView
        jobTypes={jobTypesMock}
        dispatch={hocMock.dispatch}
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('should display jobs in card view', async () => {
    await waitFor(() => {
      expect(screen.getByText('Jobs:')).toBeInTheDocument();
      expect(screen.getByText('test name')).toBeInTheDocument();
      expect(screen.getByText('test description')).toBeInTheDocument();
    });
  });

  describe('when interacting with a job', () => {
    it('should call the callback to schedule a job', async () => {
      userEvent.click(screen.getByRole('button', { name: /Schedule Job test name/i }));

      await waitFor(() => {
        expect(hocMock.dispatch).toHaveBeenCalledWith({ action: 'schedule', payload: jobTypesMock[0] });
      });
    });
  });
});

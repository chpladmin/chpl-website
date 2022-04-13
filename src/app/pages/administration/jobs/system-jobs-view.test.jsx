import React from 'react';
import {
  cleanup, render, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import ChplSystemJobsView from './system-jobs-view';

const jobsMock = [{
  name: 'job name',
  description: 'job description',
  nextRunDate: 1649852937307,
  triggerScheduleType: 'schedule type',
}];

describe('the ChplSystemJobsView component', () => {
  beforeEach(async () => {
    render(
      <ChplSystemJobsView
        jobs={jobsMock}
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('should have a table of jobs', async () => {
    expect(screen.getByRole('table', { name: 'Scheduled System Jobs table' })).toBeInTheDocument();
  });
});

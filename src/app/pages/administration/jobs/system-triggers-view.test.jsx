import React from 'react';
import {
  cleanup, render, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import ChplSystemTriggersView from './system-triggers-view';

const triggersMock = [{
  name: 'job name',
  description: 'job description',
  nextRunDate: 1649852937307,
  triggerScheduleType: 'schedule type',
}];

describe('the ChplSystemTriggersView component', () => {
  beforeEach(async () => {
    render(
      <ChplSystemTriggersView
        triggers={triggersMock}
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('should have a table of triggers', async () => {
    expect(screen.getByRole('table', { name: 'Scheduled System Jobs table' })).toBeInTheDocument();
  });
});

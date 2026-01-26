import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import ChplSystemTriggersView from './system-triggers-view';

const hocMock = {
  dispatch: jest.fn(),
};

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
        dispatch={hocMock.dispatch}
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('should display triggers in card view', async () => {
    await waitFor(() => {
      expect(screen.getByText('Scheduled Jobs:')).toBeInTheDocument();
      expect(screen.getByText('job name')).toBeInTheDocument();
      expect(screen.getByText('job description')).toBeInTheDocument();
    });
  });
});

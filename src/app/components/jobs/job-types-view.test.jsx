import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import ChplJobTypesView from './job-types-view';

import { UserContext } from 'shared/contexts';

const hocMock = {
  dispatch: jest.fn(),
};

const jobTypesMock = [{
  name: 'test name',
  description: 'test description',
  group: 'chplJobs',
  jobDataMap: {},
}];

const userContextMock = {
  hasAnyRole: () => true,
};

describe('the ChplJobTypesView component', () => {
  beforeEach(async () => {
    render(
      <UserContext.Provider value={userContextMock}>
        <ChplJobTypesView
          jobTypes={jobTypesMock}
          dispatch={hocMock.dispatch}
        />
      </UserContext.Provider>,
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('should have a table of jobs', async () => {
    expect(screen.getByRole('table', { name: 'Types of Jobs table' })).toBeInTheDocument();
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

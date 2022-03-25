import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { when } from 'jest-when';

import ChplDeveloperView from './developer-view';

import * as angularReactHelper from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';

const hocMock = {
  dispatch: jest.fn(),
};

const DateUtilMock = {
  getDisplayDateFormat: jest.fn(),
};
angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('DateUtil').mockReturnValue(DateUtilMock);

const developerMock = {
  name: 'developer name',
};

const userContextMock = {
  hasAnyRole: () => true,
  hasAuthorityOn: () => true,
};

describe('the ChplDeveloperView component', () => {
  beforeEach(async () => {
    render(
      <UserContext.Provider value={userContextMock}>
        <ChplDeveloperView
          developer={developerMock}
          dispatch={hocMock.dispatch}
          canEdit
          canMerge
          canSplit
          isSplitting={false}
        />
      </UserContext.Provider>,
    );
  });

  afterEach(() => {
    cleanup();
  });

  describe('when taking actions', () => {
    it('should call the callback for edit', async () => {
      hocMock.dispatch.mockClear();
      userEvent.click(screen.getByRole('button', { name: /Edit developer name Information/i }));

      await waitFor(() => {
        expect(hocMock.dispatch).toHaveBeenCalledWith(
          'edit',
        );
      });
    });
  });
});

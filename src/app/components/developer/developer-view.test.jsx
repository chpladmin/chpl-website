import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import developerEvent from '@testing-library/developer-event';
import { when } from 'jest-when';

import ChplDeveloperView from './developer-view';

import * as angularReactHelper from 'services/angular-react-helper';

const hocMock = {
  dispatch: jest.fn(),
};

const developerMock = {
  fullName: 'full name',
  email: 'email@sample.com',
};

describe('the ChplDeveloperView component', () => {
  beforeEach(async () => {
    render(
      <ChplDeveloperView
        developer={developerMock}
        dispatch={hocMock.dispatch}
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  describe('when taking actions', () => {
    it('should call the callback for edit', async () => {
      hocMock.dispatch.mockClear();
      developerEvent.click(screen.getByRole('button', { name: /Edit full name/i }));

      await waitFor(() => {
        expect(hocMock.dispatch).toHaveBeenCalledWith(
          'edit',
          developerMock,
        );
      });
    });
  });
});

import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { when } from 'jest-when';

import * as angularReactHelper from '../../../services/angular-react-helper';
import ChplLoginPage from './login';

const $stateMock = {
  go: jest.fn(() => {}),
};

const returnToMock = {
  state: () => 'state',
  params: () => 'params',
  options: () => { 'options'; },
};

angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('$state').mockReturnValue($stateMock);

describe('the ChplLogin page', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(async () => {
    render(
      <ChplLoginPage
        returnTo={returnToMock}
      />,
    );
  });

  describe('when rendering', () => {
    it('should have a screen', async () => {
      const item = screen;

      await waitFor(() => {
        expect(item).not.toBe(null);
      });
    });
  });
});

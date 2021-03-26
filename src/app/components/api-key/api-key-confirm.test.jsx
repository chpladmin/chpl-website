import React from 'react';
import * as angularReactHelper from '../../services/angular-react-helper.jsx';
import { render, cleanup, screen, waitFor } from '@testing-library/react';
import { toHaveTextContent } from '@testing-library/jest-dom';
import { when } from 'jest-when';
import {ChplApiKeyConfirm} from './api-key-confirm.jsx';

//These need to be mocked outside the tests due how Jest works
const networkServiceMock = {
  confirmApiKey: jest.fn(() => Promise.resolve({
      apiKey: 'new-key',
  })),
};

const networkServiceFailureMock = {
  confirmApiKey: jest.fn(() => Promise.reject({
    data: {
      errorMessages: [
        'ErrorMessage to display',
      ],
    },
   })),
};

angularReactHelper.getAngularService = jest.fn();

describe('the ChplApiKeyConfirm component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should display the API Key when successful', async() => {
    when(angularReactHelper.getAngularService).calledWith('networkService').mockReturnValue(networkServiceMock);

    render(<ChplApiKeyConfirm hash='this-is-a-hash'/>);
    const apiKeyDisplay = screen.getByTestId('api-key-display');

    await waitFor(() => {
      expect(apiKeyDisplay).toHaveTextContent('new-key')
    });
  });

  it('should display the an alert when not successful', async() => {
    when(angularReactHelper.getAngularService).calledWith('networkService').mockReturnValue(networkServiceFailureMock);
    await waitFor(() => {
      render(<ChplApiKeyConfirm hash='this-is-a-hash'/>);
    });
    const alert = screen.getByTestId('api-key-alert');

    await waitFor(() => {
      expect(alert).toBeVisible();
    });
  });
});

import React from 'react';
import {
  cleanup, render, screen,
} from '@testing-library/react';
import { when } from 'jest-when';
import '@testing-library/jest-dom';

import ChplAttestationEdit from './attestation-edit';

import * as angularReactHelper from 'services/angular-react-helper';

const $stateMock = {
  go: jest.fn(),
};
angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('$state').mockReturnValue($stateMock);

const changeRequestMock = {
};

jest.mock('./attestation-wizard', () => ({
  __esModule: true,
  default: function attestationWizard() {
    return null;
  },
}));

const mockApi = {
  isLoading: true,
  mutate: () => {},
};

jest.mock('api/change-requests', () => ({
  __esModule: true,
  usePutChangeRequest: () => mockApi,
}));

const mockEnqueue = jest.fn();

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: mockEnqueue,
  }),
}));

describe('the ChplAttestationEdit component', () => {
  beforeEach(async () => {
    render(
      <ChplAttestationEdit
        changeRequest={changeRequestMock}
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('should have a header', () => {
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Edit Attestations');
  });
});

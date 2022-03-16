import React from 'react';
import {
  cleanup, render, screen,
} from '@testing-library/react';
import { when } from 'jest-when';
import '@testing-library/jest-dom';

import ChplAttestationCreate from './attestation-create';

import * as angularReactHelper from 'services/angular-react-helper';

const $stateMock = {
  go: jest.fn(),
};
angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('$state').mockReturnValue($stateMock);

const developerMock = {
};

jest.mock('./attestation-progress', () => ({
  __esModule: true,
  default: function attestationProgress() {
    return (
      <button onClick={() => {}} type="button">mock</button>
    );
    // TODO: figure out how to mock the buttons in this component to trigger the "handleProgressDispatch" function in the unit under test
  },
}));

const mockApi = {
  isLoading: true,
  mutate: () => {},
};

jest.mock('api/attestations', () => ({
  __esModule: true,
  useFetchAttestationData: () => mockApi,
}));

jest.mock('api/change-requests', () => ({
  __esModule: true,
  useFetchChangeRequestTypes: () => mockApi,
  usePostChangeRequest: () => mockApi,
}));

const mockEnqueue = jest.fn();

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: mockEnqueue,
  }),
}));

describe('the ChplAttestationCreate component', () => {
  beforeEach(async () => {
    render(
      <ChplAttestationCreate
        developer={developerMock}
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('should have a header', () => {
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Submit Attestation');
  });
});

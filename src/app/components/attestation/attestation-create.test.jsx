import React from 'react';
import {
  cleanup, render, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import ChplAttestationCreate from './attestation-create';

const developerMock = {
};

const mockApi = {
  isSuccess: false,
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

jest.mock('api/attestations', () => ({
  __esModule: true,
  useFetchAttestationData: () => mockApi,
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

  it('should load to the "Introduction" step', () => {
    expect(screen.getByText(/Introduction/)).toBeInTheDocument();
  });
});

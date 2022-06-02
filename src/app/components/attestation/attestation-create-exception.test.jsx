import React from 'react';
import {
  cleanup, render, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import ChplAttestationCreateException from './attestation-create-exception';

const mockApi = {
  isLoading: true,
  mutate: () => {},
};

jest.mock('api/developer', () => ({
  __esModule: true,
  usePostAttestationException: () => mockApi,
}));

const mockEnqueue = jest.fn();

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: mockEnqueue,
  }),
}));

const mockProps = {
  attestations: {},
  developer: { name: 'fake developer' },
  dispatch: jest.fn(() => 'done'),
};

describe('the ChplAttestationCreateException component', () => {
  beforeEach(async () => {
    render(
      <ChplAttestationCreateException
        attestations={mockProps.attestations}
        developer={mockProps.developer}
        dispatch={mockProps.dispatch}
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('should have a description', () => {
    expect(screen.getByText(/^This action/)).toHaveTextContent(`This action will re-open the Attestations submission feature for ${mockProps.developer.name}. Please confirm you want to continue.`);
  });
});

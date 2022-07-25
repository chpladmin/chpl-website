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
  developer: { name: 'fake developer' },
  dispatch: jest.fn(() => 'done'),
  period: {
    periodStart: '2010-03-04',
    periodEnd: '2012-04-05',
  },
};

describe('the ChplAttestationCreateException component', () => {
  beforeEach(async () => {
    render(
      <ChplAttestationCreateException
        developer={mockProps.developer}
        dispatch={mockProps.dispatch}
        period={mockProps.period}
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('should have a description', () => {
    expect(screen.getByText(/^This action/)).toHaveTextContent(`This action will re-open the Attestations submission feature for ${mockProps.developer.name} for Mar 4, 2010 to Apr 5, 2012. Please confirm you want to continue.`);
  });
});

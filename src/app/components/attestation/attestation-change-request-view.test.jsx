import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import ChplAttestationChangeRequestView from './attestation-change-request-view';

const hocMock = {
  dispatch: jest.fn(),
};

const developerMock = {
  name: 'a developer name',
};

describe('the ChplAttestationChangeRequestView component', () => {
  beforeEach(async () => {
    render(
      <ChplAttestationChangeRequestView
        developer={developerMock}
        dispatch={hocMock.dispatch}
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('should have the developer name in the text', () => {
    expect(screen.getByText(/a developer name/)).toBeInTheDocument();
  });

  describe('when creating an attestation change request', () => {
    it('should call the callback', async () => {
      userEvent.click(screen.getByRole('checkbox', { name: /I attest/ }));
      userEvent.click(screen.getByRole('button', { name: /Submit Attestation Change Request/i }));

      await waitFor(() => {
        expect(hocMock.dispatch).toHaveBeenCalled();
      });
    });
  });
});

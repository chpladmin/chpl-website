import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import ChplAttestationChangeRequest from './attestation-change-request';

const hocMock = {
  onSaveRequest: jest.fn(),
};

describe('the ChplUserCreate component', () => {
  beforeEach(async () => {
    render(
      <ChplAttestationChangeRequest
        onSaveRequest={hocMock.onSaveRequest}
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  describe('when creating an attestation change request', () => {
    it('should call the callback', async () => {
      userEvent.click(screen.getByRole('button', { name: /Submit Attestation Change Request/i }));

      await waitFor(() => {
        expect(hocMock.onSaveRequest).toHaveBeenCalled();
      });
    });
  });
});

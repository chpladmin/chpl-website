import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import ChplAttestationProgress from './attestation-progress';

const hocMock = {
  dispatch: jest.fn(),
};

describe('the ChplAttestationProgress component', () => {
  beforeEach(async () => {
    render(
      <ChplAttestationProgress
        dispatch={hocMock.dispatch}
        value={1}
        canNext
        canPrevious
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('should have the steps highlighted based on state', () => {
    expect(screen.getByText(/Introduction/).closest('div').querySelector('svg')).toHaveClass('MuiStepIcon-completed');
    expect(screen.getByText(/Introduction/).closest('div').querySelector('svg')).not.toHaveClass('MuiStepIcon-active');
    expect(screen.getByText(/Attestations/).closest('div').querySelector('svg')).not.toHaveClass('MuiStepIcon-completed');
    expect(screen.getByText(/Attestations/).closest('div').querySelector('svg')).toHaveClass('MuiStepIcon-active');
    expect(screen.getByText(/Electronic Signature/).closest('div').querySelector('svg')).not.toHaveClass('MuiStepIcon-completed');
    expect(screen.getByText(/Electronic Signature/).closest('div').querySelector('svg')).not.toHaveClass('MuiStepIcon-active');
  });

  describe('when navigating', () => {
    it('should call the callback to go forward', async () => {
      userEvent.click(screen.getByRole('button', { name: /Next/ }));

      await waitFor(() => {
        expect(hocMock.dispatch).toHaveBeenCalledWith('next');
      });
    });

    it('should call the callback to go back', async () => {
      userEvent.click(screen.getByRole('button', { name: /Back/ }));

      await waitFor(() => {
        expect(hocMock.dispatch).toHaveBeenCalledWith('previous');
      });
    });
  });
});

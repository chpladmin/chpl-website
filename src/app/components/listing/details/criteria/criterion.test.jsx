import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import ChplCriterion from './criterion';

import { eventTrack } from 'services/analytics.service';

const mock = {
  listing: {
    accessibilityStandards: [],
    chplProductNumber: '15.something',
    edition: { name: '2015' },
    product: {
      name: 'a product',
    },
    qmsStandards: [],
  },
  certificationResult: {
    success: true,
    criterion: {
      number: '170.315 (z)(1)',
      title: 'Criterion Title',
    },
  },
};

jest.mock('./criterion-details-view', () => ({
  __esModule: true,
  default: jest.fn(() => 42),
}));

jest.mock('services/analytics.service', () => ({
  eventTrack: jest.fn(() => {}),
}));

describe('the ChplCriterion component', () => {
  afterEach(() => {
    cleanup();
  });

  describe('when opening the accordion', () => {
    beforeEach(async () => {
      render(
        <ChplCriterion
          certificationResult={mock.certificationResult}
          listing={mock.listing}
        />,
      );
    });

    it('should track analytics', async () => {
      userEvent.click(screen.getByText('170.315 (z)(1)'));

      await waitFor(() => {
        expect(eventTrack).toHaveBeenCalledWith({
          event: 'Show Details - 170.315 (z)(1)',
          category: 'Listing Details',
          label: '15.something',
          aggregationName: 'a product',
          group: undefined,
        });
      });
    });
  });
});

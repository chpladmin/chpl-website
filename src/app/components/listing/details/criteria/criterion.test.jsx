import React from 'react';
import { when } from 'jest-when';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import * as angularReactHelper from '../../../../services/angular-react-helper';

import ChplCriterion from './criterion';

const mock = {
  listing: {
    accessibilityStandards: [],
    edition: { name: '2015' },
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

const $analyticsMock = {
  eventTrack: jest.fn(),
};
angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('$analytics').mockReturnValue($analyticsMock);

jest.mock('./criterion-details-view', () => ({
  __esModule: true,
  default: jest.fn(() => 42),
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
      $analyticsMock.eventTrack.mockClear();
      userEvent.click(screen.getByText('170.315 (z)(1)'));

      await waitFor(() => {
        expect($analyticsMock.eventTrack).toHaveBeenCalledWith(
          'Viewed criteria details',
          { category: 'Listing Details', label: '170.315 (z)(1)' },
        );
      });
    });
  });
});

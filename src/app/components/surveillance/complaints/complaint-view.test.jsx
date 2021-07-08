import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { when } from 'jest-when';

import * as angularReactHelper from '../../../services/angular-react-helper';
import ChplComplaintView from './complaint-view';

const utilServiceMock = {
  sortCertActual: jest.fn(() => Promise.resolve(0)),
};

const hocMock = {
  dispatch: jest.fn(),
};

const complaintMock = {
  criteria: [],
  listings: [],
  surveillances: [],
};

angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('utilService').mockReturnValue(utilServiceMock);

describe('the ChplComplaintView component', () => {
  afterEach(() => {
    cleanup();
  });

  describe('when the complaint is empty', () => {
    beforeEach(async () => {
      render(
        <ChplComplaintView
          complaint={complaintMock}
          dispatch={hocMock.dispatch}
        />,
      );
    });

    it('should have no listitems', async () => {
      expect(screen.queryAllByRole('listitem').length).toBe(0);
    });

    it('should have "No" for the various complaint booleans', async () => {
      let item = await screen.findByText('Complainant Contacted:');
      expect(item.nextSibling).toHaveTextContent('No');
      item = await screen.findByText('Developer Contacted:');
      expect(item.nextSibling).toHaveTextContent('No');
      item = await screen.findByText('ONC-ATL Contacted:');
      expect(item.nextSibling).toHaveTextContent('No');
      item = await screen.findByText(/Informed ONC per/);
      expect(item.nextSibling).toHaveTextContent('No');
    });

    it('should call the callback on close', async () => {
      hocMock.dispatch.mockClear();
      userEvent.click(screen.getByRole('button', { name: /Close/i }));

      await waitFor(() => {
        expect(hocMock.dispatch).toHaveBeenCalledWith(
          'close',
        );
      });
    });
  });

  describe('when parsing criteria', () => {
    beforeEach(async () => {
      utilServiceMock.sortCertActual.mockClear();
      const criterionComplaint = {
        ...complaintMock,
        criteria: [
          {
            certificationCriterion: {
              number: 'number 2', title: 'title2', id: 2, removed: false,
            },
          },
          {
            certificationCriterion: {
              number: 'number 3', title: 'title3', id: 3, removed: true,
            },
          },
        ],
      };
      render(
        <ChplComplaintView
          complaint={criterionComplaint}
          dispatch={hocMock.dispatch}
        />,
      );
    });

    it('should have two criteria', async () => {
      expect(screen.getAllByRole('listitem').length).toBe(2);
    });

    it('should display the criteria', async () => {
      const criteria = screen.getAllByRole('listitem');
      expect(criteria[0]).toHaveTextContent('number 2: title2');
      expect(criteria[1]).toHaveTextContent('Removed | number 3: title3');
    });

    it('should farm sort out to the angular service', async () => {
      expect(utilServiceMock.sortCertActual).toHaveBeenCalled();
      expect(utilServiceMock.sortCertActual.mock.calls.length).toBe(1);
    });
  });

  describe('when parsing listings', () => {
    beforeEach(async () => {
      const listingComplaint = {
        ...complaintMock,
        listings: [
          { chplProductNumber: '2', id: 2 },
          { chplProductNumber: '1', id: 1 },
          { chplProductNumber: '3', id: 3 },
        ],
      };
      render(
        <ChplComplaintView
          complaint={listingComplaint}
          dispatch={hocMock.dispatch}
        />,
      );
    });

    it('should have three listings', async () => {
      expect(screen.getAllByRole('listitem').length).toBe(3);
    });

    it('should sort the listings', async () => {
      const listings = screen.getAllByRole('listitem');
      expect(listings[0]).toHaveTextContent('1');
      expect(listings[1]).toHaveTextContent('2');
      expect(listings[2]).toHaveTextContent('3');
    });
  });

  describe('when parsing surveillance', () => {
    beforeEach(async () => {
      const surveillanceComplaint = {
        ...complaintMock,
        surveillances: [
          { surveillance: { chplProductNumber: '2', id: 2, friendlyId: 'SURV02' } },
          { surveillance: { chplProductNumber: '1', id: 1, friendlyId: 'SURV01' } },
          { surveillance: { chplProductNumber: '2', id: 4, friendlyId: 'SURV01' } },
          { surveillance: { chplProductNumber: '2', id: 5, friendlyId: 'SURV03' } },
          { surveillance: { chplProductNumber: '3', id: 3, friendlyId: 'SURV03' } },
        ],
      };
      render(
        <ChplComplaintView
          complaint={surveillanceComplaint}
          dispatch={hocMock.dispatch}
        />,
      );
    });

    it('should have five surveillances', async () => {
      expect(screen.getAllByRole('listitem').length).toBe(5);
    });

    it('should sort the surveillances', async () => {
      const surveillances = screen.getAllByRole('listitem');
      expect(surveillances[0]).toHaveTextContent('1: SURV01');
      expect(surveillances[1]).toHaveTextContent('2: SURV01');
      expect(surveillances[2]).toHaveTextContent('2: SURV02');
      expect(surveillances[3]).toHaveTextContent('2: SURV03');
      expect(surveillances[4]).toHaveTextContent('3: SURV03');
    });
  });

  describe('when parsing toggles', () => {
    beforeEach(async () => {
      const toggleComplaint = {
        ...complaintMock,
        complainantContacted: true,
        developerContacted: true,
        oncAtlContacted: true,
        flagForOncReview: true,
      };
      render(
        <ChplComplaintView
          complaint={toggleComplaint}
          dispatch={hocMock.dispatch}
        />,
      );
    });

    it('should have "Yes" for the various complaint booleans', async () => {
      let item = await screen.findByText('Complainant Contacted:');
      expect(item.nextSibling).toHaveTextContent('Yes');
      item = await screen.findByText('Developer Contacted:');
      expect(item.nextSibling).toHaveTextContent('Yes');
      item = await screen.findByText('ONC-ATL Contacted:');
      expect(item.nextSibling).toHaveTextContent('Yes');
      item = await screen.findByText(/Informed ONC per/);
      expect(item.nextSibling).toHaveTextContent('Yes');
    });
  });
});

import React from 'react';
import {
  cleanup, render, screen, waitFor, waitForElementToBeRemoved, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { when } from 'jest-when';
import { LocalDate } from '@js-joda/core';
import * as angularReactHelper from '../../../services/angular-react-helper';
import { ChplSurveillanceActivityReportingDateSelector } from './reporting-date-selector';

// These need to be mocked outside the tests due how Jest works
const networkServiceMock = {
  getSurveillanceActivityReport: jest.fn(() => Promise.resolve({
    status: 200,
    job: {
      jobDataMap: {
        email: 'test@abc.com',
      },
    },
  })),
};

const toasterMock = {
  pop: jest.fn(),
};

angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('networkService').mockReturnValue(networkServiceMock);
when(angularReactHelper.getAngularService).calledWith('toaster').mockReturnValue(toasterMock);

const selectMaterialUiSelectOption = async (element, optionText) => new Promise((resolve) => {
  // The the button that opens the dropdown, which is a sibling of the input
  const selectButton = element.parentNode.querySelector('[role=button]');
  // Open the select dropdown
  userEvent.click(selectButton);
  // Get the dropdown element. We don't use getByRole() because it includes <select>s too.
  const listbox = document.body.querySelector('ul[role=listbox]');
  // Click the list item
  const listItem = within(listbox).getByText(optionText);
  userEvent.click(listItem);
  // Wait for the listbox to be removed, so it isn't visible in subsequent calls
  waitForElementToBeRemoved(() => document.body.querySelector('ul[role=listbox]')).then(
    resolve,
  );
});

describe('the ChplSurveillanceActivityReportingDateSelector component', () => {
  beforeEach(async () => {
    render(<ChplSurveillanceActivityReportingDateSelector />);
  });
  afterEach(() => {
    cleanup();
  });

  it('should not have any values initially', async () => {
    const year = screen.getByLabelText(/Year/i);
    const quarter = screen.getByLabelText(/Quarter/i);

    await waitFor(() => {
      expect(year.value).toBeUndefined();
      expect(quarter.value).toBeUndefined();
    });
  });

  describe('when entering valid information', () => {
    it('should have valid input values', async () => {
      const year = screen.getByLabelText(/Year/i);
      const quarter = screen.getByLabelText(/Quarter/i);

      await selectMaterialUiSelectOption(year, '2020');
      await selectMaterialUiSelectOption(quarter, 'Q2');

      await waitFor(() => {
        expect(screen.getByTestId('year-input').value).toBe('2020');
        expect(screen.getByTestId('quarter-input').value).toBe('q2');
      });
    });
  });

  describe('when entering no information', () => {
    it('should have invalid inputs', async () => {
      const button = screen.getByRole('button', { name: /Download Results/i });

      userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByTestId('year-error-text')).toBeVisible();
        expect(screen.getByTestId('quarter-error-text')).toBeVisible();
      });
    });
  });

  describe('when entering valid data', () => {
    const testData = [
      {
        year: '2020', quarter: 'Q1', expectedStartDate: LocalDate.of(2020, 1, 1), expectedEndDate: LocalDate.of(2020, 3, 31),
      },
      {
        year: '2020', quarter: 'Q2', expectedStartDate: LocalDate.of(2020, 4, 1), expectedEndDate: LocalDate.of(2020, 6, 30),
      },
      {
        year: '2020', quarter: 'Q3', expectedStartDate: LocalDate.of(2020, 7, 1), expectedEndDate: LocalDate.of(2020, 9, 30),
      },
      {
        year: '2020', quarter: 'Q4', expectedStartDate: LocalDate.of(2020, 10, 1), expectedEndDate: LocalDate.of(2020, 12, 31),
      },
      {
        year: '2020', quarter: 'All', expectedStartDate: LocalDate.of(2020, 1, 1), expectedEndDate: LocalDate.of(2020, 12, 31),
      },
    ];
    testData.forEach((item) => {
      it('should generate the valid range', async () => {
        const year = screen.getByLabelText(/Year/i);
        const quarter = screen.getByLabelText(/Quarter/i);
        const button = screen.getByRole('button', { name: /Download Results/i });

        await selectMaterialUiSelectOption(year, item.year);
        await selectMaterialUiSelectOption(quarter, item.quarter);
        userEvent.click(button);

        const startDate = item.expectedStartDate;
        const endDate = item.expectedEndDate;

        await waitFor(() => {
          expect(networkServiceMock.getSurveillanceActivityReport).toHaveBeenCalledWith({ startDate, endDate });
        });
      });
    });
    describe('when data is successfully submitted', () => {
      it('should diaply a success taoster message', async () => {
        const year = screen.getByLabelText(/Year/i);
        const quarter = screen.getByLabelText(/Quarter/i);
        const button = screen.getByRole('button', { name: /Download Results/i });

        await selectMaterialUiSelectOption(year, '2020');
        await selectMaterialUiSelectOption(quarter, 'Q1');
        userEvent.click(button);

        await waitFor(() => {
          expect(toasterMock.pop).toHaveBeenCalledWith({
            type: 'success',
            title: 'Success',
            body: 'Request for Surveillance Activity Report was successfully submitted. An email will be sent to test@abc.com with the report.',
          });
        });
      });
    });
  });
});

import React from 'react';
import ReactDOM from 'react-dom';
import {
  cleanup, render, screen, waitFor, waitForElementToBeRemoved, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { when } from 'jest-when';
import * as angularReactHelper from '../../../services/angular-react-helper';
import { LocalDate } from '@js-joda/core';
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

const selectMaterialUiSelectOption = async (element, optionText) =>
    new Promise(resolve => {
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
  let component;
  beforeEach(async () => {
      component = render(<ChplSurveillanceActivityReportingDateSelector />);
    });
  afterEach(() => {
    cleanup();
  });

  it('should not have any values initially', async () => {
    const year = screen.getByLabelText(/Year/i)
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

  describe.skip('when entering no information', () => {
    it('should have invalid inputs', async () => {
      const year = screen.getByLabelText(/Year/i);
      const quarter = screen.getByLabelText(/Quarter/i);
      const button = screen.getByRole('button', {name: /Download Results/i})

      userEvent.click(button);

      await waitFor(() => {
        expect(year).toBeInvalid();
        expect(quarter).toBeInvalid();
      });
    });
  });

  describe('when entering valid data', () => {
    describe('when the year 2020 is selected', () => {
      describe('when Q1 is selected', () => {
        it('should generate a range of 1/1/2020 to 3/31/2020', async () => {
          const year = screen.getByLabelText(/Year/i);
          const quarter = screen.getByLabelText(/Quarter/i);
          const button = screen.getByRole('button', {name: /Download Results/i})

          await selectMaterialUiSelectOption(year, '2020');
          await selectMaterialUiSelectOption(quarter, 'Q1');
          userEvent.click(button);

          const startDate = LocalDate.of(2020, 1, 1);
          const endDate = LocalDate.of(2020, 3, 31);
          await waitFor(() => {
            expect(networkServiceMock.getSurveillanceActivityReport).toHaveBeenCalledWith({ startDate, endDate });
          });
        });
      });
      describe('when Q2 is selected', () => {
        it('should generate a range of 4/1/2020 to 6/30/2020', async () => {
          const year = screen.getByLabelText(/Year/i);
          const quarter = screen.getByLabelText(/Quarter/i);
          const button = screen.getByRole('button', {name: /Download Results/i})

          await selectMaterialUiSelectOption(year, '2020');
          await selectMaterialUiSelectOption(quarter, 'Q2');
          userEvent.click(button);

          const startDate = LocalDate.of(2020, 4, 1);
          const endDate = LocalDate.of(2020, 6, 30);
          await waitFor(() => {
            expect(networkServiceMock.getSurveillanceActivityReport).toHaveBeenCalledWith({ startDate, endDate });
          });
        });
      });
      describe('when Q3 is selected', () => {
        it('should generate a range of 7/1/2020 to 9/30/2020', async () => {
          const year = screen.getByLabelText(/Year/i);
          const quarter = screen.getByLabelText(/Quarter/i);
          const button = screen.getByRole('button', {name: /Download Results/i})

          await selectMaterialUiSelectOption(year, '2020');
          await selectMaterialUiSelectOption(quarter, 'Q3');
          userEvent.click(button);

          const startDate = LocalDate.of(2020, 7, 1);
          const endDate = LocalDate.of(2020, 9, 30);
          await waitFor(() => {
            expect(networkServiceMock.getSurveillanceActivityReport).toHaveBeenCalledWith({ startDate, endDate });
          });
        });
      });
      describe('when Q4 is selected', () => {
        it('should generate a range of 10/1/2020 to 12/31/2020', async () => {
          const year = screen.getByLabelText(/Year/i);
          const quarter = screen.getByLabelText(/Quarter/i);
          const button = screen.getByRole('button', {name: /Download Results/i})

          await selectMaterialUiSelectOption(year, '2020');
          await selectMaterialUiSelectOption(quarter, 'Q4');
          userEvent.click(button);

          const startDate = LocalDate.of(2020, 10, 1);
          const endDate = LocalDate.of(2020, 12, 31);
          await waitFor(() => {
            expect(networkServiceMock.getSurveillanceActivityReport).toHaveBeenCalledWith({ startDate, endDate });
          });
        });
      });
      describe('when All is selected', () => {
        it('should generate a range of 1/1/2020 to 12/31/2020', async () => {
          const year = screen.getByLabelText(/Year/i);
          const quarter = screen.getByLabelText(/Quarter/i);
          const button = screen.getByRole('button', {name: /Download Results/i})

          await selectMaterialUiSelectOption(year, '2020');
          await selectMaterialUiSelectOption(quarter, 'All');
          userEvent.click(button);

          const startDate = LocalDate.of(2020, 1, 1);
          const endDate = LocalDate.of(2020, 12, 31);
          await waitFor(() => {
            expect(networkServiceMock.getSurveillanceActivityReport).toHaveBeenCalledWith({ startDate, endDate });
          });
        });
      });
    });
    describe('when data is successfully submitted', () => {
      it('should diaply a success taoster message', async () => {
        const year = screen.getByLabelText(/Year/i);
        const quarter = screen.getByLabelText(/Quarter/i);
        const button = screen.getByRole('button', {name: /Download Results/i})

        await selectMaterialUiSelectOption(year, '2020');
        await selectMaterialUiSelectOption(quarter, 'Q1');
        userEvent.click(button);

        const startDate = LocalDate.of(2020, 1, 1);
        const endDate = LocalDate.of(2020, 3, 31);
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

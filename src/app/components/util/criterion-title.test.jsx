import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { within } from '@testing-library/dom';
//import { when } from 'jest-when';
//import userEvent from '@testing-library/user-event';
//import * as angularReactHelper from '../../../../../services/angular-react-helper';
import ChplCriterionTitle from './criterion-title';

describe('when rendering ChplCriterionTitle component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should display the criteria number and title', async () => {
    const criterion = {
      number: 'Criteria Number',
      title: 'Criteria Title Sample',
      removed: false,
    };
    render(<ChplCriterionTitle criterion={criterion} />);

    await waitFor(() => {
      const component = screen.getByTestId('criterion-title');
      expect(within(component).queryByText(/Removed/i)).not.toBeInTheDocument();
      expect(within(component).queryByText(/Criteria Number/i)).toBeInTheDocument();
      expect(within(component).queryByText(/Criteria Title Sample/i)).toBeInTheDocument();
    });
  });

  describe('when directed no to display title', () => {
    it('should only display the criteria number', async () => {
      const criterion = {
        number: 'Criteria Number',
        title: 'Criteria Title Sample',
        removed: false,
      };
      render(<ChplCriterionTitle criterion={criterion} displayTitle={false} />);

      await waitFor(() => {
        const component = screen.getByTestId('criterion-title');
        expect(within(component).queryByText(/Removed/i)).not.toBeInTheDocument();
        expect(within(component).queryByText(/Criteria Number/i)).toBeInTheDocument();
        expect(within(component).queryByText(/Criteria Title Sample/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('when the criteria is removed', () => {
    it('should prepend "Removed | " to the criteria number', async () => {
      const criterion = {
        number: 'Criteria Number',
        title: 'Criteria Title Sample',
        removed: true,
      };
      render(<ChplCriterionTitle criterion={criterion} />);

      await waitFor(() => {
        const component = screen.getByTestId('criterion-title');
        expect(within(component).queryByText(/Removed/i)).toBeInTheDocument();
        expect(within(component).queryByText(/Criteria Number/i)).toBeInTheDocument();
        expect(within(component).queryByText(/Criteria Title Sample/i)).toBeInTheDocument();
      });
    });

    describe('when directed to "useRemovedClass"', () => {
      it('should include the style class "removed"', async () => {
        const criterion = {
          number: 'Criteria Number',
          title: 'Criteria Title Sample',
          removed: true,
        };
        render(<ChplCriterionTitle criterion={criterion} useRemovedClass />);

        await waitFor(() => {
          const component = screen.getByTestId('criterion-title');
          expect(component).toHaveClass('removed');
          expect(within(component).queryByText(/Removed/i)).toBeInTheDocument();
          expect(within(component).queryByText(/Criteria Number/i)).toBeInTheDocument();
          expect(within(component).queryByText(/Criteria Title Sample/i)).toBeInTheDocument();
        });
      });
    });
  });
});
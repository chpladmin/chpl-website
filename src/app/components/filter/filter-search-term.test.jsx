import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { when } from 'jest-when';
import userEvent from '@testing-library/user-event';

import ChplFilterSearchTerm from './filter-search-term';

import * as angularReactHelper from 'services/angular-react-helper';

const $analyticsMock = {
  eventTrack: jest.fn(),
};
angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('$analytics').mockReturnValue($analyticsMock);

const mockValue = {
  setSearchTerm: jest.fn(() => {}),
  searchTerm: '',
};

jest.mock('./filter-context', () => ({
  __esModule: true,
  useFilterContext: () => mockValue,
}));

describe('the ChplFilterSearchTerm component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders a search box', async () => {
    render(
      <ChplFilterSearchTerm />,
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Search by Developer/)).toBeInTheDocument();
    });
  });

  it('renders a search box with a specific placeholder', async () => {
    render(
      <ChplFilterSearchTerm
        placeholder="Not default"
      />,
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Not default/)).toBeInTheDocument();
    });
  });

  it('uses the setSearchTerm function to submit a search', async () => {
    render(
      <ChplFilterSearchTerm />,
    );

    userEvent.type(screen.getByRole('textbox'), 'test');
    userEvent.click(screen.getByText('Go'));

    await waitFor(() => {
      expect(mockValue.setSearchTerm).toHaveBeenCalledWith('test');
    });
  });
});

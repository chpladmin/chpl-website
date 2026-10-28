import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplJoinDevelopers from './developer-join';

import { useFetchDevelopers } from 'api/developer';
import { DeveloperContext } from 'shared/contexts';

jest.mock('notistack', () => ({
  useSnackbar: () => ({ enqueueSnackbar: () => {} }),
}));
jest.mock('api/developer', () => ({
  useFetchDevelopers: jest.fn(),
  usePutJoinDevelopers: () => ({ mutate: () => {} }),
}));
jest.mock('components/action-bar', () => ({
  ChplActionBar: () => null,
  useActionBar: () => {},
}));

const developer = {
  id: 1,
  name: 'Retained Developer',
  developerCode: '0001',
  statuses: [],
};

const renderPage = () => render(
  <DeveloperContext.Provider value={{ developer }}>
    <ChplJoinDevelopers dispatch={() => {}} />
  </DeveloperContext.Provider>,
);

describe('joining developers', () => {
  it('shows a skeleton of the selector and instructions, and neither of them, while the developers load', () => {
    useFetchDevelopers.mockReturnValue({ data: undefined, isLoading: true });
    renderPage();

    expect(screen.getByRole('status')).toHaveTextContent('Loading developers');
    expect(screen.queryByText('Select Developers joining Retained Developer')).not.toBeInTheDocument();
    expect(screen.queryByText('Instructions')).not.toBeInTheDocument();
  });

  it('shows the selector, without the retained developer, once they have loaded', () => {
    useFetchDevelopers.mockReturnValue({
      data: [developer, {
        id: 2,
        name: 'Other Developer',
        developerCode: '0002',
        statuses: [],
      }],
      isLoading: false,
    });
    renderPage();

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Instructions')).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Other Developer' })).toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: 'Retained Developer' })).not.toBeInTheDocument();
  });
});

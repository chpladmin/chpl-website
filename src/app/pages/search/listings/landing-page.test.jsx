import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplLandingPage from './landing-page';

import { useFetchAnnouncements } from 'api/announcements';
import { useFilterContext } from 'components/filter';

jest.mock('api/announcements', () => ({
  useFetchAnnouncements: jest.fn(),
}));

// The search bar isn't what's under test, only whether its filters are loading
jest.mock('components/filter', () => ({
  ChplFilterSearchBar: () => <div>search bar</div>,
  useFilterContext: jest.fn(),
}));

const announcements = (state) => useFetchAnnouncements.mockReturnValue({
  data: undefined,
  isLoading: false,
  isSuccess: false,
  ...state,
});

const filters = (isLoading) => useFilterContext.mockReturnValue({ isLoading });

describe('the landing page', () => {
  beforeEach(() => filters(false));

  it('is all skeleton while the announcements load, with none of the real page', () => {
    announcements({ isLoading: true });
    render(<ChplLandingPage />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading the CHPL');
    expect(screen.queryByText('Welcome to the Certified Health IT Product List')).not.toBeInTheDocument();
    expect(screen.queryByText('search bar')).not.toBeInTheDocument();
    expect(screen.queryByText('Real World Testing')).not.toBeInTheDocument();
  });

  it('shows the whole page, announcements included, once they arrive', () => {
    announcements({ data: [{ id: 1, title: 'Planned maintenance', startDate: 1 }], isSuccess: true });
    render(<ChplLandingPage />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Welcome to the Certified Health IT Product List')).toBeInTheDocument();
    expect(screen.getByText('Planned maintenance')).toBeInTheDocument();
    expect(screen.getByText('Real World Testing')).toBeInTheDocument();
  });

  it('stays all skeleton while the search filters load, even once the announcements are in', () => {
    announcements({ data: [], isSuccess: true });
    filters(true);
    render(<ChplLandingPage />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading the CHPL');
    expect(screen.queryByText('Real World Testing')).not.toBeInTheDocument();
  });

  it('shows the page without announcements when there are none', () => {
    announcements({ data: [], isSuccess: true });
    render(<ChplLandingPage />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByText(/^Announcement/)).not.toBeInTheDocument();
    expect(screen.getByText('Charts')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, within } from '@testing-library/react';

import ChplResourcesOverview from './overview';

import { useFetchAcbs } from 'api/acbs';
import { useFetchAnnouncements } from 'api/announcements';
import { useFetchAtls } from 'api/atls';

jest.mock('api/acbs', () => ({
  useFetchAcbs: jest.fn(),
}));

jest.mock('api/announcements', () => ({
  useFetchAnnouncements: jest.fn(),
}));

jest.mock('api/atls', () => ({
  useFetchAtls: jest.fn(),
}));

jest.mock('services/analytics.service', () => ({
  eventTrack: jest.fn(),
}));

jest.mock('shared/contexts', () => ({
  useAnalyticsContext: () => ({ analytics: {} }),
}));

const loading = { data: undefined, isLoading: true, isSuccess: false };
const loaded = (data) => ({ data, isLoading: false, isSuccess: true });
const acb = {
  id: 1,
  name: 'An ACB',
  acbCode: '01',
  website: 'https://example.com/acb',
};
const atl = {
  id: 2,
  name: 'An ATL',
  atlCode: '02',
  website: 'https://example.com/atl',
};

const mockQueries = ({ announcements, orgs }) => {
  useFetchAnnouncements.mockReturnValue(announcements);
  useFetchAcbs.mockReturnValue(orgs ? loaded({ acbs: [acb] }) : loading);
  useFetchAtls.mockReturnValue(orgs ? loaded({ atls: [atl] }) : loading);
};

describe('the CHPL overview', () => {
  it('shows its static sections while the announcements and organizations load', () => {
    mockQueries({ announcements: loading, orgs: false });
    render(<ChplResourcesOverview />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading announcements, ONC-ACBs and ONC-ATLs');
    expect(screen.getByRole('heading', { name: 'CHPL Overview' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'What is the CHPL?' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'ONC-ACB and ONC-ATL Information' })).toBeInTheDocument();
    expect(screen.queryByText('There are no current announcements.')).not.toBeInTheDocument();
    expect(screen.queryByText('An ACB')).not.toBeInTheDocument();
  });

  it('shows the announcements and organizations once they arrive', () => {
    mockQueries({ announcements: loaded([{ id: 3, title: 'An Announcement', startDate: 1 }]), orgs: true });
    render(<ChplResourcesOverview />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('An Announcement')).toBeInTheDocument();
    const table = screen.getAllByRole('table').find((t) => t.id === 'acbAtlTable');
    expect(within(table).getByText('An ACB')).toBeInTheDocument();
    expect(within(table).getByText('An ATL')).toBeInTheDocument();
  });

  it('keeps the announcements section, and its navigation, when there are none', () => {
    mockQueries({ announcements: loaded([]), orgs: true });
    render(<ChplResourcesOverview />);
    expect(screen.getByRole('heading', { name: 'Announcements' })).toBeInTheDocument();
    expect(screen.getByText('There are no current announcements.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Announcements/ })).toBeInTheDocument();
  });
});

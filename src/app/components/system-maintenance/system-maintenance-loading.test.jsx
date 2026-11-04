import React from 'react';
import { render, screen } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';

import ChplAnnouncements from './announcement/announcements';
import ChplApiKeys from './api-key/api-keys';
import ChplCqms from './cqm/cqms';
import ChplStandards from './standard/standards';
import ChplSystemMaintenanceLoading from './system-maintenance-loading';

import { useFetchAnnouncements } from 'api/announcements';
import { useFetchApiKeys } from 'api/api-keys';
import {
  useFetchCqms,
  useFetchCriteriaForStandards,
  useFetchRules,
  useFetchStandards,
} from 'api/standards';
import { UserContext } from 'shared/contexts';

jest.mock('api/activity', () => ({
  useFetchAnnouncementsActivity: () => ({ data: undefined, isLoading: true, isSuccess: false }),
  useFetchApiKeyActivity: () => ({ data: undefined, isLoading: true, isSuccess: false }),
  useFetchStandardsActivity: () => ({ data: undefined, isLoading: true, isSuccess: false }),
}));
jest.mock('api/announcements', () => ({
  useDeleteAnnouncement: () => ({ mutate: jest.fn() }),
  useFetchAnnouncements: jest.fn(),
  usePostAnnouncement: () => ({ mutate: jest.fn() }),
  usePutAnnouncement: () => ({ mutate: jest.fn() }),
}));
jest.mock('api/api-keys', () => ({
  useDeleteKey: () => ({ mutate: jest.fn() }),
  useFetchApiKeys: jest.fn(),
}));
jest.mock('api/standards', () => ({
  useDeleteStandard: () => ({ isLoading: false, mutate: jest.fn() }),
  useFetchCqms: jest.fn(),
  useFetchCriteriaForStandards: jest.fn(),
  useFetchRules: jest.fn(),
  useFetchStandards: jest.fn(),
  usePostStandard: () => ({ isLoading: false, mutate: jest.fn() }),
  usePutStandard: () => ({ isLoading: false, mutate: jest.fn() }),
}));

const loading = { data: undefined, isLoading: true, isSuccess: false };
const loaded = (data) => ({ data, isLoading: false, isSuccess: true });

const renderAs = (ui, roles = []) => render(
  <SnackbarProvider>
    <UserContext.Provider value={{ hasAnyRole: (r) => r.some((role) => roles.includes(role)), hasAuthorityOn: () => false }}>
      { ui }
    </UserContext.Provider>
  </SnackbarProvider>,
);

// The rectangular shapes stand for the search bar, sidebar, controls and buttons
const rectangles = (container) => container.querySelectorAll('.MuiSkeleton-rectangular').length;

describe('the System Maintenance skeleton', () => {
  it('announces its label once, and hides its shapes', () => {
    renderAs(<ChplSystemMaintenanceLoading label="Loading things" />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading things');
    expect(screen.getByRole('status').querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('draws the Add and Edit buttons only for the users who see them', () => {
    const cards = 3;
    const { container: admin } = renderAs(<ChplSystemMaintenanceLoading editable cards={cards} />, ['chpl-admin']);
    const { container: acb } = renderAs(<ChplSystemMaintenanceLoading editable cards={cards} />, ['chpl-onc-acb']);

    // one Add control, and one Edit button per card
    expect(rectangles(admin) - rectangles(acb)).toBe(1 + cards);
  });

  it('draws a search bar and sidebar for a card with filters', () => {
    const { container: plain } = renderAs(<ChplSystemMaintenanceLoading />);
    const { container: filtered } = renderAs(<ChplSystemMaintenanceLoading filter />);

    expect(rectangles(filtered) - rectangles(plain)).toBe(2);
  });
});

describe('a System Maintenance list', () => {
  it('shows the skeleton while it loads, and its content once it arrives', () => {
    useFetchCqms.mockReturnValue(loading);
    const { rerender } = renderAs(<ChplCqms />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading CQMs');
    expect(screen.queryByText('CQMs')).not.toBeInTheDocument();

    useFetchCqms.mockReturnValue(loaded([{
      id: 1, cmsId: 'CMS2', title: 'A measure', description: 'About it', versions: ['v1'],
    }]));
    rerender(
      <SnackbarProvider>
        <ChplCqms />
      </SnackbarProvider>,
    );

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('A measure')).toBeInTheDocument();
  });
});

describe('the API Keys list', () => {
  it('shows the skeleton while it loads', () => {
    useFetchApiKeys.mockReturnValue(loading);
    renderAs(<ChplApiKeys />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading API keys');
  });

  it('shows the empty list, rather than loading forever, when there are no keys', () => {
    useFetchApiKeys.mockReturnValue(loaded([]));
    renderAs(<ChplApiKeys />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('(0 Results)')).toBeInTheDocument();
  });
});

describe('the Announcements list', () => {
  it('shows the skeleton while it loads, not "No results found"', () => {
    useFetchAnnouncements.mockReturnValue(loading);
    renderAs(<ChplAnnouncements />, ['chpl-admin']);

    expect(screen.getByRole('status')).toHaveTextContent('Loading announcements');
    expect(screen.queryByText('No results found')).not.toBeInTheDocument();
  });

  it('still says "No results found" once it has loaded with none', () => {
    useFetchAnnouncements.mockReturnValue(loaded([]));
    renderAs(<ChplAnnouncements />, ['chpl-admin']);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });
});

describe('the Standards list', () => {
  const standard = {
    id: 1, value: 'A standard', regulatoryTextCitation: '170.315', criteria: [], retired: false,
  };

  beforeEach(() => {
    useFetchRules.mockReturnValue(loaded([]));
    useFetchStandards.mockReturnValue(loaded([standard]));
  });

  it('keeps the skeleton, with no real search bar, until the filter options arrive', () => {
    useFetchCriteriaForStandards.mockReturnValue(loading);
    renderAs(<ChplStandards />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading standards');
    expect(screen.queryByText('A standard')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/Search by Value/)).not.toBeInTheDocument();
  });

  it('shows the search bar and the list together once everything has arrived', () => {
    useFetchCriteriaForStandards.mockReturnValue(loaded([]));
    renderAs(<ChplStandards />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search by Value/)).toBeInTheDocument();
    expect(screen.getByText('A standard')).toBeInTheDocument();
  });
});

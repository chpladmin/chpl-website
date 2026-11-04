import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplOncOrganizations from './onc-organizations';

import { useFetchAcbs, useFetchUsersAtAcb } from 'api/acbs';
import { useFetchAtls } from 'api/atls';
import { UserContext } from 'shared/contexts';

jest.mock('notistack', () => ({
  useSnackbar: () => ({ enqueueSnackbar: () => {} }),
}));
jest.mock('api/acbs', () => ({
  useDeleteUserFromAcb: () => ({ mutate: () => {} }),
  useFetchAcbs: jest.fn(),
  useFetchUsersAtAcb: jest.fn(),
  usePostUserInvitation: () => ({ mutate: () => {} }),
}));
jest.mock('api/atls', () => ({
  useFetchAtls: jest.fn(),
}));
jest.mock('components/onc-organization/onc-organization', () => function ChplOncOrganization({ organization }) {
  const mockReact = jest.requireActual('react');
  return mockReact.createElement('div', { 'data-testid': 'organization' }, organization.name);
});
jest.mock('components/user/users', () => function ChplUsers({ isLoading }) {
  const mockReact = jest.requireActual('react');
  return mockReact.createElement('div', { 'data-testid': 'users', 'data-loading': String(isLoading) });
});

const loading = { data: undefined, isLoading: true, isSuccess: false };
const onc = { hasAnyRole: (roles) => roles.includes('chpl-onc') };
const acbUser = { hasAnyRole: (roles) => roles.includes('chpl-onc-acb') };

const renderPage = ({ orgType = 'acb', user = onc } = {}) => render(
  <UserContext.Provider value={user}>
    <ChplOncOrganizations orgType={orgType} />
  </UserContext.Provider>,
);

const menuNames = () => screen.queryAllByRole('button')
  .filter((button) => button.id.startsWith('onc-organizations-navigation-'))
  .map((button) => button.id.replace('onc-organizations-navigation-', ''));

describe('the ONC organizations page', () => {
  beforeEach(() => {
    useFetchAcbs.mockReturnValue(loading);
    useFetchAtls.mockReturnValue(loading);
    useFetchUsersAtAcb.mockReturnValue({
      data: { users: [] },
      isInitialLoading: false,
      isLoading: false,
      isSuccess: true,
    });
  });

  describe('while the organizations load', () => {
    it('shows ONC staff a skeleton of the menu, without the real menu or maintenance card', () => {
      renderPage();

      expect(screen.getByRole('status')).toHaveTextContent('Loading ONC-ACBs');
      expect(menuNames()).toEqual([]);
      expect(screen.queryByText('ONC Organization maintenance')).not.toBeInTheDocument();
    });

    it('names ONC-ATLs on the ONC-ATL page', () => {
      renderPage({ orgType: 'atl' });

      expect(screen.getByRole('status')).toHaveTextContent('Loading ONC-ATLs');
    });

    it('shows an ONC-ACB user the shape of their own organization', () => {
      renderPage({ user: acbUser });

      expect(screen.getByRole('status')).toHaveTextContent('Loading ONC-ACBs');
      expect(screen.queryByTestId('organization')).not.toBeInTheDocument();
    });
  });

  it('shows the menu and the maintenance card once there are several organizations', () => {
    useFetchAcbs.mockReturnValue({
      data: { acbs: [{ id: 2, name: 'ICSA Labs' }, { id: 1, name: 'Drummond Group' }] },
      isLoading: false,
      isSuccess: true,
    });
    renderPage();

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(menuNames()).toEqual(['Drummond Group', 'ICSA Labs']);
    expect(screen.getByText('ONC Organization maintenance')).toBeInTheDocument();
  });

  it('opens a single organization straight away', () => {
    useFetchAcbs.mockReturnValue({
      data: { acbs: [{ id: 1, name: 'ICSA Labs' }] },
      isLoading: false,
      isSuccess: true,
    });
    renderPage({ user: acbUser });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByTestId('organization')).toHaveTextContent('ICSA Labs');
    expect(screen.getByTestId('users')).toBeInTheDocument();
  });

  it('shows ONC-ATLs on the ONC-ATL page', () => {
    useFetchAtls.mockReturnValue({
      data: { atls: [{ id: 2, name: 'SLI Compliance' }, { id: 1, name: 'drummond' }] },
      isLoading: false,
      isSuccess: true,
    });
    renderPage({ orgType: 'atl' });

    expect(menuNames()).toEqual(['drummond', 'SLI Compliance']);
  });

  it('shows the users of an ONC-ACB as loading while they are fetched', () => {
    useFetchAcbs.mockReturnValue({
      data: { acbs: [{ id: 1, name: 'ICSA Labs' }] },
      isLoading: false,
      isSuccess: true,
    });
    useFetchUsersAtAcb.mockReturnValue({
      data: undefined,
      isInitialLoading: true,
      isLoading: true,
      isSuccess: false,
    });
    renderPage({ user: acbUser });

    expect(screen.getByTestId('users')).toHaveAttribute('data-loading', 'true');
  });

  // The users query is disabled for ONC-ATLs, and react-query v4 keeps a
  // disabled query isLoading for good
  it('does not wait on the disabled users query for an ONC-ATL', () => {
    useFetchAtls.mockReturnValue({
      data: { atls: [{ id: 1, name: 'SLI Compliance' }] },
      isLoading: false,
      isSuccess: true,
    });
    useFetchUsersAtAcb.mockReturnValue({
      data: undefined,
      isInitialLoading: false,
      isLoading: true,
      isSuccess: false,
    });
    renderPage({ orgType: 'atl' });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByTestId('organization')).toHaveTextContent('SLI Compliance');
    expect(screen.queryByTestId('users')).not.toBeInTheDocument();
  });
});

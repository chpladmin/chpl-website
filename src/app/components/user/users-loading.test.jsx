import React from 'react';
import { render, screen } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';

import ChplUsersView from './users-view';

import { useFetchUsersAtDeveloper } from 'api/developer';
import { useFetchUsers, usePostCreateInvitation, usePutUser } from 'api/users';
import ChplDeveloperView from 'pages/organizations/developers/developer/developer-view';
import ChplUsersPage from 'pages/users/users';
import { DeveloperContext, FlagContext, UserContext } from 'shared/contexts';

jest.mock('api/developer', () => ({ useFetchUsersAtDeveloper: jest.fn() }));
jest.mock('api/users', () => ({
  useFetchUsers: jest.fn(),
  usePostCreateInvitation: jest.fn(),
  usePutUser: jest.fn(),
}));

// The developer page's other sections load their own data; only its users card is under test
jest.mock('components/attestation/attestations-view', () => () => null);
jest.mock('components/change-request/change-requests', () => () => null);
jest.mock('components/developer/developer-view', () => () => null);
jest.mock('components/direct-reviews/direct-reviews', () => () => null);
jest.mock('components/insights/insights-view', () => () => null);
jest.mock('components/products/products', () => () => null);
jest.mock('components/real-world-testing/real-world-testing-view', () => () => null);
jest.mock('components/sbul/sbuls-view', () => () => null);

const user = {
  cognitoId: 'abc',
  fullName: 'Pat Example',
  email: 'pat@example.com',
  role: 'chpl-onc',
  status: 'CONFIRMED',
};

const developer = { id: 7, name: 'Some Developer', statuses: [] };

const renderAs = (roles, ui, { authority = true } = {}) => render(
  <SnackbarProvider>
    <UserContext.Provider value={{
      hasAnyRole: (r) => r.some((role) => roles.includes(role)),
      hasAuthorityOn: () => authority,
    }}
    >
      <FlagContext.Provider value={{}}>
        <DeveloperContext.Provider value={{ developer }}>
          { ui }
        </DeveloperContext.Provider>
      </FlagContext.Provider>
    </UserContext.Provider>
  </SnackbarProvider>,
);

beforeEach(() => {
  usePutUser.mockReturnValue({ mutate: jest.fn() });
  usePostCreateInvitation.mockReturnValue({ mutate: jest.fn() });
});

describe('the Manage Users card', () => {
  it('shows a skeleton of the card while its users load', () => {
    renderAs(['chpl-onc'], <ChplUsersView users={[]} dispatch={jest.fn()} groupNames={[]} isLoading />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading users');
    expect(screen.queryByText('Manage Users')).not.toBeInTheDocument();
  });

  it('still shows the users once they have loaded', () => {
    renderAs(['chpl-onc'], <ChplUsersView users={[user]} dispatch={jest.fn()} groupNames={[]} />);

    expect(screen.queryByText('Loading users')).not.toBeInTheDocument();
    expect(screen.getByText('Manage Users')).toBeInTheDocument();
    expect(screen.getByText('Pat Example')).toBeInTheDocument();
  });
});

describe('the CHPL Users page', () => {
  it('shows the users skeleton while the users load', () => {
    useFetchUsers.mockReturnValue({ data: undefined, isLoading: true, isSuccess: false });
    renderAs(['chpl-admin'], <ChplUsersPage />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading users');
  });

  it('still lists the ONC and CMS users once they arrive', () => {
    useFetchUsers.mockReturnValue({
      data: {
        users: [user, {
          ...user, cognitoId: 'def', fullName: 'Dev User', role: 'chpl-developer',
        }],
      },
      isLoading: false,
      isSuccess: true,
    });
    renderAs(['chpl-admin'], <ChplUsersPage />);

    expect(screen.getByText('Pat Example')).toBeInTheDocument();
    expect(screen.queryByText('Dev User')).not.toBeInTheDocument();
  });
});

describe('the users card on a developer page', () => {
  it('shows the users skeleton while an ONC user waits for the developer\'s users', () => {
    useFetchUsersAtDeveloper.mockReturnValue({
      data: undefined, isLoading: true, isInitialLoading: true, isSuccess: false,
    });
    renderAs(['chpl-onc'], <ChplDeveloperView dispatch={jest.fn()} />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading users');
  });

  it('still shows the developer\'s users once they arrive', () => {
    useFetchUsersAtDeveloper.mockReturnValue({
      data: { users: [user] }, isLoading: false, isInitialLoading: false, isSuccess: true,
    });
    renderAs(['chpl-onc'], <ChplDeveloperView dispatch={jest.fn()} />);

    expect(screen.getByText('Pat Example')).toBeInTheDocument();
  });

  // react-query v4 keeps a disabled query isLoading, which used to leave a spinner up for good
  it('shows no users card, and no endless loading, to a developer user without authority on the developer', () => {
    useFetchUsersAtDeveloper.mockReturnValue({
      data: undefined, isLoading: true, isInitialLoading: false, isSuccess: false,
    });
    renderAs(['chpl-developer'], <ChplDeveloperView dispatch={jest.fn()} />, { authority: false });

    expect(useFetchUsersAtDeveloper).toHaveBeenLastCalledWith(expect.objectContaining({ enabled: false }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByText('Manage Users')).not.toBeInTheDocument();
  });
});

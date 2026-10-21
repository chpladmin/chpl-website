import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplDeveloperView from './developer-view';

import { useFetchUsersAtDeveloper } from 'api/developer';
import { DeveloperContext, FlagContext, UserContext } from 'shared/contexts';

jest.mock('api/developer', () => ({
  useFetchUsersAtDeveloper: jest.fn(),
}));

// The panels are covered elsewhere; here they only need to show whether they rendered.
// A function declaration, so it is hoisted along with the jest.mock calls that use it.
function mockStub(testId) {
  return function Stub() {
    const mockReact = jest.requireActual('react');
    return mockReact.createElement('div', { 'data-testid': testId });
  };
}
jest.mock('components/attestation/attestations-view', () => mockStub('attestations'));
jest.mock('components/change-request/change-requests', () => mockStub('change-requests'));
jest.mock('components/direct-reviews/direct-reviews', () => mockStub('direct-reviews'));
jest.mock('components/insights/insights-view', () => mockStub('insights'));
jest.mock('components/products/products', () => mockStub('products'));
jest.mock('components/real-world-testing/real-world-testing-view', () => mockStub('real-world-testing'));
jest.mock('components/sbul/sbuls-view', () => mockStub('sbuls'));
jest.mock('components/user/users', () => mockStub('users'));

// Exposes the permission callbacks the details panel is handed
jest.mock('components/developer/developer-view', () => function ChplDeveloperViewDetails({ canEdit, canJoin, canSplit }) {
  const mockReact = jest.requireActual('react');
  return mockReact.createElement('div', {
    'data-testid': 'details',
    'data-can-edit': String(canEdit()),
    'data-can-join': String(canJoin()),
    'data-can-split': String(canSplit()),
  });
});

const MEMBER_ORG_ID = 1;

const activeDeveloper = {
  id: MEMBER_ORG_ID,
  name: 'Developer',
  products: [{ id: 1 }, { id: 2 }],
  statuses: [],
};

const inactiveDeveloper = {
  ...activeDeveloper,
  statuses: [{ id: 1, startDay: '2024-01-01', status: { name: 'Suspended by ONC' } }],
};

const userWith = (role, organizationIds = []) => ({
  hasAnyRole: (roles) => roles.includes(role),
  hasAuthorityOn: (organization) => organizationIds.includes(organization.id),
});

const admin = userWith('chpl-admin');
const onc = userWith('chpl-onc');
const acb = userWith('chpl-onc-acb');
const memberDeveloper = userWith('chpl-developer', [MEMBER_ORG_ID]);
const otherDeveloper = userWith('chpl-developer', [MEMBER_ORG_ID + 1]);

const renderView = ({ user, developer = activeDeveloper, demographicChangeRequestIsOn = false }) => render(
  <UserContext.Provider value={user}>
    <FlagContext.Provider value={{ demographicChangeRequestIsOn, insightsDisplayIsOn: false }}>
      <DeveloperContext.Provider value={{ developer, setDeveloper: () => {} }}>
        <ChplDeveloperView dispatch={() => {}} />
      </DeveloperContext.Provider>
    </FlagContext.Provider>
  </UserContext.Provider>,
);

const permissions = () => {
  const details = screen.getByTestId('details');
  return {
    edit: details.dataset.canEdit === 'true',
    join: details.dataset.canJoin === 'true',
    split: details.dataset.canSplit === 'true',
  };
};

const usersFetchEnabled = () => useFetchUsersAtDeveloper.mock.calls[useFetchUsersAtDeveloper.mock.calls.length - 1][0].enabled;

describe('the Developer page', () => {
  beforeEach(() => {
    useFetchUsersAtDeveloper.mockReset();
    useFetchUsersAtDeveloper.mockReturnValue({ data: { users: [] }, isLoading: false, isSuccess: true });
  });

  describe('details permissions', () => {
    it.each([
      ['admin', admin, { edit: true, join: true, split: true }],
      ['ONC', onc, { edit: true, join: true, split: true }],
      ['ACB', acb, { edit: true, join: false, split: true }],
      ['developer of this developer', memberDeveloper, { edit: false, join: false, split: false }],
      ['developer of another developer', otherDeveloper, { edit: false, join: false, split: false }],
    ])('gives %s the right actions on an active developer', (_, user, expected) => {
      renderView({ user });

      expect(permissions()).toEqual(expected);
    });

    it.each([
      ['admin', admin, { edit: true, join: true, split: true }],
      ['ONC', onc, { edit: true, join: true, split: true }],
      ['ACB', acb, { edit: false, join: false, split: false }],
    ])('gives %s the right actions on an inactive developer', (_, user, expected) => {
      renderView({ user, developer: inactiveDeveloper });

      expect(permissions()).toEqual(expected);
    });

    it('does not let anyone split a developer with fewer than two products', () => {
      renderView({ user: admin, developer: { ...activeDeveloper, products: [{ id: 1 }] } });

      expect(permissions().split).toBe(false);
    });

    describe('with demographic change requests on', () => {
      it('lets a developer of this developer edit it while it is active', () => {
        renderView({ user: memberDeveloper, demographicChangeRequestIsOn: true });

        expect(permissions().edit).toBe(true);
      });

      it('does not let a developer of this developer edit it while it is inactive', () => {
        renderView({ user: memberDeveloper, developer: inactiveDeveloper, demographicChangeRequestIsOn: true });

        expect(permissions().edit).toBe(false);
      });

      it('does not let a developer of another developer edit it', () => {
        renderView({ user: otherDeveloper, demographicChangeRequestIsOn: true });

        expect(permissions().edit).toBe(false);
      });
    });
  });

  describe('change requests panel', () => {
    it('shows for a developer of this developer', () => {
      renderView({ user: memberDeveloper });

      expect(screen.getByTestId('change-requests')).toBeInTheDocument();
    });

    it.each([
      ['admin', admin],
      ['ONC', onc],
      ['ACB', acb],
      ['developer of another developer', otherDeveloper],
    ])('does not show for %s', (_, user) => {
      renderView({ user });

      expect(screen.queryByTestId('change-requests')).not.toBeInTheDocument();
    });
  });

  describe('users panel', () => {
    it.each([
      ['admin', admin],
      ['ONC', onc],
      ['ACB', acb],
      ['developer of this developer', memberDeveloper],
    ])('shows for %s on an active developer, and fetches its users', (_, user) => {
      renderView({ user });

      expect(screen.getByTestId('users')).toBeInTheDocument();
      expect(usersFetchEnabled()).toBe(true);
    });

    it.each([
      ['admin', admin],
      ['ONC', onc],
    ])('shows for %s on an inactive developer, and fetches its users', (_, user) => {
      renderView({ user, developer: inactiveDeveloper });

      expect(screen.getByTestId('users')).toBeInTheDocument();
      expect(usersFetchEnabled()).toBe(true);
    });

    it.each([
      ['developer of another developer', otherDeveloper, activeDeveloper],
      ['ACB on an inactive developer', acb, inactiveDeveloper],
      ['developer of this developer while it is inactive', memberDeveloper, inactiveDeveloper],
    ])('does not show for %s, and does not fetch users', (_, user, developer) => {
      renderView({ user, developer });

      expect(screen.queryByTestId('users')).not.toBeInTheDocument();
      expect(usersFetchEnabled()).toBe(false);
    });
  });

  it.each([
    ['admin', admin],
    ['developer of another developer', otherDeveloper],
  ])('always shows the public panels to %s', (_, user) => {
    renderView({ user });

    ['details', 'attestations', 'real-world-testing', 'sbuls', 'direct-reviews', 'products']
      .forEach((testId) => expect(screen.getByTestId(testId)).toBeInTheDocument());
  });
});

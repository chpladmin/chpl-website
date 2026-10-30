import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplAttestationsView from './attestations-view';

import { useFetchAttestations } from 'api/developer';
import { UserContext } from 'shared/contexts';

jest.mock('api/developer', () => ({
  useFetchAttestations: jest.fn(),
}));
jest.mock('./attestation-create-exception', () => () => null);
jest.mock('./attestation-view', () => () => null);

const MEMBER_ORG_ID = 1;

const developer = {
  id: MEMBER_ORG_ID,
  name: 'Developer',
  attestations: [{
    id: 1,
    status: 'ATTESTATIONS_SUBMITTED',
    statusText: 'Attestations submitted',
    attestationPeriod: { id: 1, periodStart: '2024-01-01', periodEnd: '2024-12-31' },
  }],
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

const renderView = (user) => render(
  <UserContext.Provider value={user}>
    <ChplAttestationsView developer={{ ...developer, attestations: [...developer.attestations] }} dispatch={() => {}} />
  </UserContext.Provider>,
);

const attestationsFetchEnabled = () => useFetchAttestations.mock.calls[useFetchAttestations.mock.calls.length - 1][0].isAuthenticated;

describe('the Attestations panel', () => {
  beforeEach(() => {
    useFetchAttestations.mockReset();
    useFetchAttestations.mockReturnValue({ data: { submittablePeriod: { id: 2 }, attestations: [] } });
  });

  it.each([
    ['admin', admin],
    ['ONC', onc],
    ['ACB', acb],
    ['developer of this developer', memberDeveloper],
  ])('fetches attestation details for %s', (_, user) => {
    renderView(user);

    expect(attestationsFetchEnabled()).toBe(true);
  });

  it('does not fetch attestation details for a developer of another developer', () => {
    renderView(otherDeveloper);

    expect(attestationsFetchEnabled()).toBe(false);
  });

  it('lets a developer of this developer submit attestations', () => {
    renderView(memberDeveloper);

    expect(screen.getByRole('button', { name: 'Submit Attestations' })).toBeInTheDocument();
  });

  it.each([
    ['admin', admin],
    ['ACB', acb],
    ['developer of another developer', otherDeveloper],
  ])('does not let %s submit attestations', (_, user) => {
    renderView(user);

    expect(screen.queryByRole('button', { name: 'Submit Attestations' })).not.toBeInTheDocument();
  });

  it('shows submitted attestations to a developer of another developer, without the details button', () => {
    renderView(otherDeveloper);

    expect(screen.getByText('Attestations submitted')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /View attestations for period ending/ })).not.toBeInTheDocument();
  });

  it('shows the details button to a developer of this developer', () => {
    renderView(memberDeveloper);

    expect(screen.getByRole('button', { name: 'View attestations for period ending 2024-12-31' })).toBeInTheDocument();
  });
});

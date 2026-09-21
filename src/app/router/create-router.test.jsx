import React from 'react';
import { UIRouter, UIView, memoryLocationPlugin } from '@uirouter/react';
import {
  act, render, screen, waitFor,
} from '@testing-library/react';
import { string } from 'prop-types';

import createRouter from './create-router';

// These cover the parts of the AngularJS -> @uirouter/react move that only
// show up when the router actually renders: that a matched state mounts its
// component, that URL params and resolves arrive as props (replacing the
// $stateParams shuttle components), and that data.roles is still inherited
// from an abstract parent (the auth guard depends on it).

function Listing({ id }) {
  return <div data-testid="page">{`listing:${id}`}</div>;
}
Listing.propTypes = { id: string };

function OncOrgs({ orgType }) {
  return <div data-testid="page">{`org:${orgType}`}</div>;
}
OncOrgs.propTypes = { orgType: string };

const states = [
  { name: 'search', url: '/search', component: () => <div data-testid="page">search</div> },
  // A url param only reaches the component if a resolve lifts it out of the
  // transition; UIView passes resolves (and `transition`) as props, never raw
  // params. This resolve is what replaces the $stateParams shuttle components.
  {
    name: 'listing',
    url: '/listing/{id}',
    component: Listing,
    resolve: [{ token: 'id', deps: ['$transition$'], resolveFn: (transition) => transition.params().id }],
  },
  { name: 'unresolvedListing', url: '/unresolved/{id}', component: Listing },
  {
    name: 'oncAcbs',
    url: '/onc-acbs',
    component: OncOrgs,
    resolve: [{ token: 'orgType', deps: [], resolveFn: () => 'acb' }],
  },
  {
    name: 'surveillance',
    abstract: true,
    url: '/surveillance',
    data: { title: 'Surveillance', roles: ['chpl-admin', 'chpl-onc-acb'] },
    component: () => <UIView />,
  },
  {
    name: 'surveillance.complaints',
    url: '/complaints',
    data: { title: 'Complaints' },
    component: () => <div data-testid="page">complaints</div>,
  },
];

// <UIRouter> calls router.start() during its own mount effect, even when it is
// handed a pre-built instance, so nothing here may start the router itself.
const renderAt = async (stateName, params) => {
  const router = createRouter(states, { locationPlugin: memoryLocationPlugin });
  render(<UIRouter router={router}><UIView /></UIRouter>);
  await act(async () => { await router.stateService.go(stateName, params); });
  return router;
};

describe('the react router', () => {
  it('renders the component for the active state', async () => {
    await renderAt('search');
    await waitFor(() => expect(screen.getByTestId('page')).toHaveTextContent('search'));
  });

  it('passes a resolved url parameter to the component as a prop', async () => {
    await renderAt('listing', { id: '1234' });
    await waitFor(() => expect(screen.getByTestId('page')).toHaveTextContent('listing:1234'));
  });

  // Guards the trap above: without a resolve the param is reachable on the
  // transition but never reaches props, so porting a state by dropping its
  // resolve would silently render undefined.
  it('does not pass url parameters as props without a resolve', async () => {
    const router = await renderAt('unresolvedListing', { id: '1234' });
    expect(router.globals.params.id).toBe('1234');
    await waitFor(() => expect(screen.getByTestId('page')).toHaveTextContent('listing:undefined'));
  });

  it('passes resolved values to the component as props', async () => {
    await renderAt('oncAcbs');
    await waitFor(() => expect(screen.getByTestId('page')).toHaveTextContent('org:acb'));
  });

  it('renders a child state through its parent view', async () => {
    await renderAt('surveillance.complaints');
    await waitFor(() => expect(screen.getByTestId('page')).toHaveTextContent('complaints'));
  });

  it('re-renders when the state changes', async () => {
    const router = await renderAt('search');
    await waitFor(() => expect(screen.getByTestId('page')).toHaveTextContent('search'));
    await act(async () => { await router.stateService.go('listing', { id: '99' }); });
    await waitFor(() => expect(screen.getByTestId('page')).toHaveTextContent('listing:99'));
  });

  it('writes hash urls when using the hash location plugin', async () => {
    const router = createRouter(states);
    router.start();
    await router.stateService.go('listing', { id: '77' });
    expect(window.location.hash).toBe('#/listing/77');
  });

  // The auth guard matches on state.data.roles and abstract parents supply
  // roles to children that only declare a title. Inheritance is via the
  // prototype chain, so spreading or serialising `data` would drop it.
  it('inherits data.roles from an abstract parent', async () => {
    const router = createRouter(states, { locationPlugin: memoryLocationPlugin });
    router.start();
    const child = router.stateRegistry.get('surveillance.complaints');
    expect(child.data.title).toBe('Complaints');
    expect(child.data.roles).toEqual(['chpl-admin', 'chpl-onc-acb']);
    expect(Object.prototype.hasOwnProperty.call(child.data, 'roles')).toBe(false);
  });

  it('runs a transition hook that can read the inherited roles', async () => {
    const router = createRouter(states, { locationPlugin: memoryLocationPlugin });
    const seen = [];
    router.transitionService.onBefore(
      { to: (state) => state.data && state.data.roles },
      (transition) => { seen.push(transition.to().data.roles); return true; },
    );
    router.start();
    await router.stateService.go('surveillance.complaints');
    expect(seen).toEqual([['chpl-admin', 'chpl-onc-acb']]);
  });
});

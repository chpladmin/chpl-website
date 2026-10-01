import React from 'react';
import { UIRouter } from '@uirouter/react';
import { render, screen } from '@testing-library/react';

import configureRouter from './configure';
import router from './router';
import states from './states';
import SkipLink from './views/skip-link';

// Exercises the real router instance: the same states, hooks and hash-location
// plugin the application boots with. configureRouter mutates the singleton, so
// it is called exactly once here - registering a state twice throws.
const configured = configureRouter();

describe('the configured application router', () => {
  it('is the singleton instance', () => {
    expect(configured).toBe(router);
  });

  // The full tree, so an accidentally dropped or renamed state fails here.
  // Every one of these names is referenced somewhere as an sref.
  it('registers exactly the expected states', () => {
    expect(states.map((state) => state.name).sort()).toEqual([
      'administration',
      'administration.change-requests',
      'administration.cms',
      'administration.confirm',
      'administration.confirm.listings',
      'administration.confirm.listings.listing',
      'administration.reports',
      'administration.system-maintenance',
      'administration.upload',
      'administration.url-checker',
      'authorizePasswordReset',
      'charts',
      'compare',
      'compliance-dashboard',
      'forgot-password',
      'listing',
      'login',
      'not-found',
      'organizations',
      'organizations.developers',
      'organizations.developers.developer',
      'organizations.onc-acbs',
      'organizations.onc-atls',
      'product',
      'registration',
      'registration.api-key',
      'registration.create-user',
      'reports',
      'reports.activity',
      'reports.questionable-activity',
      'resources',
      'resources.api',
      'resources.chpl-api',
      'resources.chpl_api',
      'resources.cms-lookup',
      'resources.download',
      'resources.overview',
      'search',
      'shortcut',
      'shortcut.api-documentation',
      'shortcut.banned-developers',
      'shortcut.corrective-action',
      'shortcut.decertified-products',
      'shortcut.decision-support-interventions',
      'shortcut.inactive-certificates',
      'shortcut.real-world-testing',
      'shortcut.sed',
      'shortcut.svap',
      'subscriptions',
      'subscriptions.confirm',
      'subscriptions.manage',
      'subscriptions.unsubscribe',
      'surveillance',
      'surveillance.activity-reporting',
      'surveillance.complaints',
      'surveillance.reporting',
      'users',
    ]);
    states.forEach((state) => {
      expect(router.stateRegistry.get(state.name)).toBeTruthy();
    });
  });

  it('registers the states with their urls intact', () => {
    expect(router.stateRegistry.get('listing').url).toBe('/listing/{id}');
    expect(router.stateRegistry.get('administration.confirm.listings.listing').url).toBe('/{id}/confirm');
    // shortcut is a url-less namespacing parent
    expect(router.stateRegistry.get('shortcut').url).toBeUndefined();
  });

  // The effective role gate for every protected state, as the onBefore guard
  // sees it - so inherited roles are included. This is the security-critical
  // invariant of the whole migration: a state dropping out of this table, or
  // losing a role, opens it up. Two of these (surveillance.complaints and
  // .reporting) declare no roles of their own and rely on inheritance.
  it('gates exactly the expected states, with the expected roles', () => {
    const onc = ['chpl-admin', 'chpl-onc'];
    const oncAcb = ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'];
    const expected = {
      'administration.change-requests': oncAcb,
      'administration.cms': ['chpl-admin', 'chpl-onc', 'chpl-cms-staff'],
      'administration.confirm.listings': ['chpl-admin', 'chpl-onc-acb'],
      'administration.confirm.listings.listing': ['chpl-admin', 'chpl-onc-acb'],
      'administration.reports': oncAcb,
      'administration.system-maintenance': oncAcb,
      'administration.upload': oncAcb,
      'administration.url-checker': oncAcb,
      'compliance-dashboard': onc,
      'organizations.onc-acbs': oncAcb,
      'organizations.onc-atls': onc,
      reports: oncAcb,
      'reports.activity': onc,
      'reports.questionable-activity': onc,
      surveillance: oncAcb,
      'surveillance.activity-reporting': onc,
      'surveillance.complaints': oncAcb,
      'surveillance.reporting': oncAcb,
      users: onc,
    };

    const actual = {};
    states.forEach(({ name }) => {
      const { roles } = router.stateRegistry.get(name).data ?? {};
      if (roles) { actual[name] = roles; }
    });

    expect(actual).toEqual(expected);
  });

  // The skip link has to carry the current route, because a bare
  // "#main-content" would replace the hash route entirely.
  it('builds a skip link that keeps the current route in the href', async () => {
    await router.stateService.go('search');
    render(<UIRouter router={router}><SkipLink /></UIRouter>);
    expect(screen.getByText('Skip to main content'))
      .toHaveAttribute('href', '#/search#main-content');
  });
});

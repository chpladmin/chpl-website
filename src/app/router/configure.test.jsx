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

  it('registers every state in the tree', () => {
    expect(states).toHaveLength(57);
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

  it('keeps roles reachable on states that inherit them', () => {
    expect(router.stateRegistry.get('surveillance.complaints').data.roles)
      .toEqual(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']);
    expect(router.stateRegistry.get('surveillance.reporting').data.roles)
      .toEqual(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']);
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

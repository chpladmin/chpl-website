import React from 'react';
import {
  act, render, screen, waitFor,
} from '@testing-library/react';

import AppRoot from './app-root';
import configureRouter from './configure';
import router from './router';

// Boots the real application root: the real router, the real state tree and
// the real provider stack. Network calls fail under jsdom, which is fine -
// this exists to catch the app failing to mount at all, and to pin the
// behaviour the provider hoist was for.
//
// Only one render per file: <UIRouter> starts the router on mount, and the
// instance is a singleton, so mounting a second one throws.

configureRouter();

describe('the application root', () => {
  it('boots and keeps the page chrome mounted across navigation', async () => {
    render(<AppRoot />);

    // the skip link sits outside the provider stack and must come first
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();

    // ChplAppLayout's chrome, from the single hoisted AppWrapper (MUI AppBar
    // renders a <header>)
    await waitFor(() => expect(document.querySelector('header')).toBeTruthy());
    expect(document.querySelectorAll('header')).toHaveLength(1);

    const chromeBefore = document.querySelector('header');

    await act(async () => { await router.stateService.go('charts'); });

    // The same DOM node, not a replacement. When every route mounted its own
    // AppWrapper, navigating tore the whole provider stack and chrome down and
    // rebuilt it, which is what reset the feature flags mid-navigation.
    expect(document.querySelector('header')).toBe(chromeBefore);
    expect(document.querySelectorAll('header')).toHaveLength(1);
  });
});

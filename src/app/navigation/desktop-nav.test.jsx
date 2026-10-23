import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import ChplDesktopNav from './desktop-nav';

import widgetReducer from 'components/action-widget/widget.slice';

const renderNav = ({ open = null } = {}) => {
  const store = configureStore({
    reducer: { widget: widgetReducer },
    preloadedState: { widget: { open } },
  });
  render(
    <Provider store={store}>
      <ChplDesktopNav onHomeClick={jest.fn()} onSearchClick={jest.fn()} />
    </Provider>,
  );
  return store;
};

const click = (name) => fireEvent.click(screen.getByRole('button', { name }));

describe('the desktop navigation widget buttons', () => {
  it.each([
    ['CMS ID Creator', 'cms'],
    ['Compare Products', 'compare'],
  ])('%s opens its widget when neither is open', (name, widget) => {
    const store = renderNav();
    click(name);

    expect(store.getState().widget.open).toBe(widget);
    expect(screen.getByRole('button', { name })).toHaveAttribute('aria-expanded', 'true');
  });

  it.each([
    ['CMS ID Creator', 'cms'],
    ['Compare Products', 'compare'],
  ])('%s closes its widget when it is open', (name, widget) => {
    const store = renderNav({ open: widget });
    click(name);

    expect(store.getState().widget.open).toBeNull();
    expect(screen.getByRole('button', { name })).toHaveAttribute('aria-expanded', 'false');
  });

  it('switches from one widget to the other', () => {
    const store = renderNav({ open: 'compare' });
    click('CMS ID Creator');

    expect(store.getState().widget.open).toBe('cms');
    expect(screen.getByRole('button', { name: 'Compare Products' })).toHaveAttribute('aria-expanded', 'false');
  });

  it.each(['Home', 'Search CHPL'])('%s closes an open widget', (name) => {
    const store = renderNav({ open: 'cms' });
    click(name);

    expect(store.getState().widget.open).toBeNull();
  });
});

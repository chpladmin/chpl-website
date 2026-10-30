import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import ChplAppLayout from './app-layout';

import widgetReducer from 'components/action-widget/widget.slice';

jest.mock('navigation/navigation-top', () => () => null);
jest.mock('navigation/navigation-bottom', () => () => null);

// The widget displays are covered on their own; here they only show which one rendered
function mockDisplay(name) {
  return function Display({ onClose }) {
    const mockReact = jest.requireActual('react');
    return mockReact.createElement('button', { type: 'button', onClick: onClose }, `Close ${name}`);
  };
}
jest.mock('components/cms-widget/cms-display', () => mockDisplay('cms'));
jest.mock('components/compare-widget/compare-display', () => mockDisplay('compare'));

const renderLayout = (open) => {
  const store = configureStore({
    reducer: { widget: widgetReducer },
    preloadedState: { widget: { open } },
  });
  render(
    <Provider store={store}>
      <ChplAppLayout>
        <div>Page</div>
      </ChplAppLayout>
    </Provider>,
  );
  return store;
};

describe('the widget panel', () => {
  it('shows nothing while neither widget is open', () => {
    renderLayout(null);

    expect(screen.getByText('Page')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Close/ })).not.toBeInTheDocument();
  });

  it.each(['cms', 'compare'])('shows only the %s widget while it is open', (widget) => {
    renderLayout(widget);

    expect(screen.getAllByRole('button', { name: /^Close/ }).map((b) => b.textContent)).toEqual([`Close ${widget}`]);
  });

  it('closes the widget from its close button', () => {
    const store = renderLayout('compare');
    fireEvent.click(screen.getByRole('button', { name: 'Close compare' }));

    expect(store.getState().widget.open).toBeNull();
    expect(screen.queryByRole('button', { name: /^Close/ })).not.toBeInTheDocument();
  });
});

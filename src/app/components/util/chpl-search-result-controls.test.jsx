import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import ChplSearchResultControls from './chpl-search-result-controls';

import widgetReducer from 'components/action-widget/widget.slice';

const renderControls = (open) => {
  const store = configureStore({
    reducer: { widget: widgetReducer },
    preloadedState: { widget: { open } },
  });
  render(
    <Provider store={store}>
      <ChplSearchResultControls recordCount={30} pageStart={1} pageEnd={10}>
        <button type="button">Download</button>
      </ChplSearchResultControls>
    </Provider>,
  );
  return screen.getByRole('button', { name: 'Download' }).parentElement;
};

// An open widget narrows the page without changing the viewport, so the
// actions are told to wrap rather than relying on the breakpoints
describe('the search result controls', () => {
  it('keep the actions on one line when no widget is open', () => {
    expect(renderControls(null)).toHaveStyle({ flexWrap: 'nowrap' });
  });

  it.each(['cms', 'compare'])('wrap the actions when the %s widget is open', (open) => {
    expect(renderControls(open)).toHaveStyle({ flexWrap: 'wrap' });
  });
});

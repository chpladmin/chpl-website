import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';

import ChplFilterPanel from './filter-panel';

import { FilterProvider, defaultFilter } from 'components/filter';
import pageStateReducer from 'components/page-state/pageState.slice';

const filters = [{
  ...defaultFilter,
  key: 'currentStatusNames',
  display: 'Change Request Status',
  values: [{ value: 'Accepted' }],
}];

// jsdom lays nothing out, so a search bar measures 0px wide and the panel uses
// its fallback size, which extraWidth adjusts the same way. Each render gets a
// new store, so no filter state carries over between tests
const openPanel = (props) => {
  render(
    <Provider store={configureStore({ reducer: { pageState: pageStateReducer } })}>
      <FilterProvider filters={filters} storageKey="test-filterPanel">
        <ChplFilterPanel extraWidth={props.extraWidth} width={props.width} />
      </FilterProvider>
    </Provider>,
  );
  fireEvent.click(document.getElementById('filter-panel-toggle'));
  return document.querySelector('#filter-panel-form .MuiPopover-paper');
};

describe('the filter panel', () => {
  it('is its usual size by default', () => {
    expect(openPanel({})).toHaveStyle({ width: 'calc(100vw - 316px)' });
  });

  it('is wider by extraWidth, for a page whose filter names need the room', () => {
    expect(openPanel({ extraWidth: '240px' })).toHaveStyle({ width: 'calc(100vw - 316px + 240px)' });
  });

  it('takes a size of its own from width, in place of the usual one', () => {
    expect(openPanel({ extraWidth: '240px', width: '750px' })).toHaveStyle({ width: '750px' });
  });
});

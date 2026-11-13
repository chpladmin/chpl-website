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

// Drives the `up('md')` media query the panel reads to tell whether the search
// bar's buttons sit beside the input (desktop) or wrap below it (mobile)
const mockIsDesktopWidth = (matches) => {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches,
    media: query,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
};

describe('the filter panel', () => {
  describe('on desktop, where the search bar\'s buttons sit beside the input', () => {
    beforeEach(() => mockIsDesktopWidth(true));

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

  describe('on mobile, where the search bar\'s buttons wrap onto their own row below the input', () => {
    beforeEach(() => mockIsDesktopWidth(false));

    it('is its usual size by default, with nothing subtracted for buttons that are not beside it', () => {
      expect(openPanel({})).toHaveStyle({ width: 'calc(100vw - 32px)' });
    });

    it('is wider by extraWidth, for a page whose filter names need the room', () => {
      expect(openPanel({ extraWidth: '240px' })).toHaveStyle({ width: 'calc(100vw - 32px + 240px)' });
    });

    it('takes a size of its own from width, in place of the usual one', () => {
      expect(openPanel({ extraWidth: '240px', width: '750px' })).toHaveStyle({ width: '750px' });
    });
  });

  // A category button's label is clipped with CSS ellipsis when it doesn't fit,
  // so its full text has to reach a screen reader some other way. ChplTooltip
  // (MUI Tooltip under the hood) sets this as an aria-label on the element it
  // wraps, independent of whether anyone ever hovers or focuses it - that's
  // what 508 compliance is checking for, not the visible hover popup
  it('exposes a category button\'s full name as an aria-label, for when it is clipped', () => {
    openPanel({});
    expect(document.getElementById('filter-panel-primary-items-currentStatusNames'))
      .toHaveAttribute('aria-label', 'Change Request Status');
  });

  it('exposes the active category\'s full name as an aria-label on the secondary panel title', () => {
    openPanel({});
    fireEvent.click(document.getElementById('filter-panel-primary-items-currentStatusNames'));
    expect(document.getElementById('filter-panel-secondary-subheader').querySelector('h6'))
      .toHaveAttribute('aria-label', 'Change Request Status');
  });
});

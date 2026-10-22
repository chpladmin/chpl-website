import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';

import ChplCmsDisplay from './cms-display';

import { useFetchCmsIdAnalysis } from 'api/cms';
import widgetReducer from 'components/action-widget/widget.slice';
import browserInfoReducer, { initialState as browserInfoDefaults } from 'components/browser/browserInfo.slice';

jest.mock('api/cms', () => ({
  useFetchCmsIdAnalysis: jest.fn(),
  useFetchCmsIdPdf: () => ({}),
  usePostCreateCmsId: () => ({ mutate: jest.fn(), isLoading: false }),
}));
// The PDF builder needs a canvas, which jsdom doesn't have
jest.mock('./cms-pdf', () => jest.fn());

const summary = (id) => ({
  id,
  chplProductNumber: `15.04.04.1234.PROD.0${id}.00.1.240101`,
  name: `Product ${id}`,
  product: { name: `Product ${id}` },
  version: { version: '1.0' },
  certificationDay: '2024-01-01',
});

const renderDisplay = ({ cms = [summary(1), summary(2)], compare = [summary(9)] } = {}) => {
  const store = configureStore({
    reducer: { browserInfo: browserInfoReducer, widget: widgetReducer },
    preloadedState: {
      browserInfo: { ...browserInfoDefaults, cms, compare },
      widget: { open: 'cms' },
    },
  });
  render(
    <Provider store={store}>
      <ChplCmsDisplay onClose={jest.fn()} />
    </Provider>,
  );
  return store;
};

describe('the CMS ID widget', () => {
  beforeEach(() => {
    useFetchCmsIdAnalysis.mockReturnValue({
      data: [],
      isFetching: false,
      isLoading: false,
      isSuccess: false,
    });
  });

  it('analyses the listings it holds', () => {
    renderDisplay();

    expect(useFetchCmsIdAnalysis).toHaveBeenLastCalledWith([summary(1), summary(2)]);
  });

  it('replaces the compare widget\'s listings with its own, and switches to the compare widget', () => {
    const store = renderDisplay();
    fireEvent.click(document.getElementById('compare-listings'));

    expect(store.getState().browserInfo.compare).toEqual([summary(1), summary(2)]);
    expect(store.getState().browserInfo.cms).toEqual([summary(1), summary(2)]);
    expect(store.getState().widget.open).toBe('compare');
  });

  it('removes every listing it holds, leaving the compare widget alone', () => {
    const store = renderDisplay();
    fireEvent.click(document.getElementById('remove-listings'));

    expect(store.getState().browserInfo.cms).toEqual([]);
    expect(store.getState().browserInfo.compare).toEqual([summary(9)]);
  });
});

import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import ChplCmsDisplay from './cms-display';

import { useFetchCmsIdAnalysis, useFetchCmsIdPdf, usePostCreateCmsId } from 'api/cms';
import widgetReducer from 'components/action-widget/widget.slice';
import browserInfoReducer, { initialState as browserInfoDefaults } from 'components/browser/browserInfo.slice';
import { FlagContext } from 'shared/contexts';

jest.mock('api/cms', () => ({
  useFetchCmsIdAnalysis: jest.fn(),
  useFetchCmsIdPdf: jest.fn(),
  usePostCreateCmsId: jest.fn(),
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

const createStore = ({ cms = [summary(1), summary(2)], compare = [summary(9)] } = {}) => configureStore({
  reducer: { browserInfo: browserInfoReducer, widget: widgetReducer },
  preloadedState: {
    browserInfo: { ...browserInfoDefaults, cms, compare },
    widget: { open: 'cms' },
  },
});

const view = (store) => (
  <Provider store={store}>
    <FlagContext.Provider value={{ cmsDisabledIsOn: false }}>
      <ChplCmsDisplay onClose={jest.fn()} />
    </FlagContext.Provider>
  </Provider>
);

const renderDisplay = (state) => {
  const store = createStore(state);
  const result = render(view(store));
  return { ...result, store };
};

const analysis = [{
  year: '2015',
  ehrCertificationId: '0015EABCDEFGHIJ',
  products: [{ id: 1 }],
  metPercentages: { criteriaMet: 100 },
  missingAnd: [],
  missingOr: [],
  missingUpToDate: [],
}];

const analysisWith = (state) => useFetchCmsIdAnalysis.mockReturnValue({
  data: undefined,
  isFetching: false,
  isLoading: false,
  isSuccess: false,
  ...state,
});
const loaded = () => analysisWith({ data: analysis, isSuccess: true });
// A new set of products is a new query: no data for it yet, so react-query reports both
const firstLoad = () => analysisWith({ isFetching: true, isLoading: true });
const refetching = () => analysisWith({ data: analysis, isFetching: true, isSuccess: true });

const loadingStatus = () => screen.queryByText('Loading CMS ID analysis');
const spinner = () => document.getElementById('cms-id-processing');

beforeEach(() => {
  useFetchCmsIdPdf.mockReturnValue({ data: undefined, isFetching: false, isSuccess: false });
  usePostCreateCmsId.mockReturnValue({ mutate: jest.fn(), isLoading: false });
});

describe('the CMS ID widget', () => {
  beforeEach(() => {
    analysisWith({ data: [] });
  });

  it('analyses the listings it holds', () => {
    renderDisplay();

    expect(useFetchCmsIdAnalysis).toHaveBeenLastCalledWith([summary(1), summary(2)]);
  });

  it('replaces the compare widget\'s listings with its own, and switches to the compare widget', () => {
    const { store } = renderDisplay();
    fireEvent.click(document.getElementById('compare-listings'));

    expect(store.getState().browserInfo.compare).toEqual([summary(1), summary(2)]);
    expect(store.getState().browserInfo.cms).toEqual([summary(1), summary(2)]);
    expect(store.getState().widget.open).toBe('compare');
  });

  it('removes every listing it holds, leaving the compare widget alone', () => {
    const { store } = renderDisplay();
    fireEvent.click(document.getElementById('remove-listings'));

    expect(store.getState().browserInfo.cms).toEqual([]);
    expect(store.getState().browserInfo.compare).toEqual([summary(9)]);
  });
});

describe('once the analysis has loaded', () => {
  it('shows the CMS ID and validation, and no loading state', () => {
    loaded();
    renderDisplay({ cms: [summary(1)] });
    expect(screen.getByText('0015EABCDEFGHIJ')).toBeInTheDocument();
    expect(screen.getByText('Validation')).toBeInTheDocument();
    expect(loadingStatus()).not.toBeInTheDocument();
    expect(spinner()).not.toBeInTheDocument();
  });

  it('keeps the analysis and shows the spinner over it while it refreshes', () => {
    loaded();
    const { rerender, store } = renderDisplay({ cms: [summary(1)] });
    refetching();
    rerender(view(store));
    expect(screen.getByText('Validation')).toBeInTheDocument();
    expect(spinner()).toBeInTheDocument();
    expect(loadingStatus()).not.toBeInTheDocument();
  });
});

describe('while the first analysis loads', () => {
  it('shows the skeleton, announced as loading, in place of the analysis', () => {
    firstLoad();
    renderDisplay({ cms: [summary(1)] });
    expect(screen.getByRole('status')).toHaveTextContent('Loading CMS ID analysis');
    expect(screen.queryByText('Validation')).not.toBeInTheDocument();
  });

  it('shows the skeleton instead of the spinner', () => {
    firstLoad();
    renderDisplay({ cms: [summary(1)] });
    expect(spinner()).not.toBeInTheDocument();
  });

  it('shows none of the real widget until the analysis arrives', () => {
    firstLoad();
    renderDisplay({ cms: [summary(1)] });
    expect(screen.queryByText('CMS Certification ID Creator')).not.toBeInTheDocument();
    expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Product Selected')).not.toBeInTheDocument();
  });

  it('shows the header and selected products once the analysis arrives', () => {
    loaded();
    renderDisplay({ cms: [summary(1)] });
    expect(screen.getByText('CMS Certification ID Creator')).toBeInTheDocument();
    expect(screen.getByText('Product 1')).toBeInTheDocument();
  });

  it('hides the analysis for the previous products until the new one arrives', () => {
    loaded();
    const { rerender, store } = renderDisplay({ cms: [summary(1)] });
    expect(screen.getByText('0015EABCDEFGHIJ')).toBeInTheDocument();
    firstLoad();
    rerender(view(store));
    expect(screen.queryByText('0015EABCDEFGHIJ')).not.toBeInTheDocument();
    expect(screen.queryByText('Validation')).not.toBeInTheDocument();
    expect(loadingStatus()).toBeInTheDocument();
  });
});

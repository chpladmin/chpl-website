import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplCmsDisplay from './cms-display';

import { useFetchCmsIdAnalysis, useFetchCmsIdPdf, usePostCreateCmsId } from 'api/cms';
import { CmsContext, CompareContext, FlagContext } from 'shared/contexts';

jest.mock('api/cms', () => ({
  useFetchCmsIdAnalysis: jest.fn(),
  useFetchCmsIdPdf: jest.fn(),
  usePostCreateCmsId: jest.fn(),
}));

const listings = [{ id: 1, name: 'Alpha EHR' }];

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

const view = () => (
  <FlagContext.Provider value={{ cmsDisabledIsOn: false }}>
    <CompareContext.Provider value={{
      listings: [], addListing: jest.fn(), removeListing: jest.fn(), setIsOpen: jest.fn(),
    }}
    >
      <CmsContext.Provider value={{ listings, removeListing: jest.fn(), setIsOpen: jest.fn() }}>
        <ChplCmsDisplay onClose={jest.fn()} />
      </CmsContext.Provider>
    </CompareContext.Provider>
  </FlagContext.Provider>
);

const loadingStatus = () => screen.queryByText('Loading CMS ID analysis');
const spinner = () => document.getElementById('cms-id-processing');

beforeEach(() => {
  useFetchCmsIdPdf.mockReturnValue({ data: undefined, isFetching: false, isSuccess: false });
  usePostCreateCmsId.mockReturnValue({ mutate: jest.fn(), isLoading: false });
});

describe('once the analysis has loaded', () => {
  it('shows the CMS ID and validation, and no loading state', () => {
    loaded();
    render(view());
    expect(screen.getByText('0015EABCDEFGHIJ')).toBeInTheDocument();
    expect(screen.getByText('Validation')).toBeInTheDocument();
    expect(loadingStatus()).not.toBeInTheDocument();
    expect(spinner()).not.toBeInTheDocument();
  });

  it('keeps the analysis and shows the spinner over it while it refreshes', () => {
    loaded();
    const { rerender } = render(view());
    refetching();
    rerender(view());
    expect(screen.getByText('Validation')).toBeInTheDocument();
    expect(spinner()).toBeInTheDocument();
    expect(loadingStatus()).not.toBeInTheDocument();
  });
});

describe('while the first analysis loads', () => {
  it('shows the skeleton, announced as loading, in place of the analysis', () => {
    firstLoad();
    render(view());
    expect(screen.getByRole('status')).toHaveTextContent('Loading CMS ID analysis');
    expect(screen.queryByText('Validation')).not.toBeInTheDocument();
  });

  it('shows the skeleton instead of the spinner', () => {
    firstLoad();
    render(view());
    expect(spinner()).not.toBeInTheDocument();
  });

  it('shows none of the real widget until the analysis arrives', () => {
    firstLoad();
    render(view());
    expect(screen.queryByText('CMS Certification ID Creator')).not.toBeInTheDocument();
    expect(screen.queryByText('Alpha EHR')).not.toBeInTheDocument();
    expect(screen.queryByText('Product Selected')).not.toBeInTheDocument();
  });

  it('shows the header and selected products once the analysis arrives', () => {
    loaded();
    render(view());
    expect(screen.getByText('CMS Certification ID Creator')).toBeInTheDocument();
    expect(screen.getByText('Alpha EHR')).toBeInTheDocument();
  });

  it('hides the analysis for the previous products until the new one arrives', () => {
    loaded();
    const { rerender } = render(view());
    expect(screen.getByText('0015EABCDEFGHIJ')).toBeInTheDocument();
    firstLoad();
    rerender(view());
    expect(screen.queryByText('0015EABCDEFGHIJ')).not.toBeInTheDocument();
    expect(screen.queryByText('Validation')).not.toBeInTheDocument();
    expect(loadingStatus()).toBeInTheDocument();
  });
});

import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import { useFetchAcbs } from 'api/acbs';
import { useFetchCriteria, useFetchSvaps } from 'api/standards';
import widgetReducer from 'components/action-widget/widget.slice';
import pageStateReducer from 'components/page-state/pageState.slice';
import ChplDevelopersPage from 'pages/organizations/developers/developers';
import ChplApiDocumentationSearchPage from 'pages/search/api-documentation/api-documentation';
import ChplBannedDevelopersSearchPage from 'pages/search/banned-developers/banned-developers';
import ChplCorrectiveActionSearchPage from 'pages/search/corrective-action/corrective-action';
import ChplDecertifiedProductsSearchPage from 'pages/search/decertified-products/decertified-products';
import ChplDecisionSupportInterventionsSearchPage from 'pages/search/decision-support-interventions/decision-support-interventions';
import ChplInactiveCertificatesSearchPage from 'pages/search/inactive-certificates/inactive-certificates';
import ChplSedSearchPage from 'pages/search/sed/sed';
import ChplSvapSearchPage from 'pages/search/svap/svap';
import { UserContext } from 'shared/contexts';

jest.mock('api/acbs', () => ({ useFetchAcbs: jest.fn() }));
jest.mock('api/standards', () => ({ useFetchCriteria: jest.fn(), useFetchSvaps: jest.fn() }));

// Each page's results view is swapped for a probe that reports whether the
// filter bar and chips have been told the filter options are still loading. A
// function declaration, so it's hoisted along with the jest.mock calls using it
function mockProbe() {
  // eslint-disable-next-line global-require
  const { useFilterContext } = require('components/filter');
  return function ChplFilterLoadingProbe() {
    const { isLoading } = useFilterContext();
    return <div data-testid="filters">{ isLoading ? 'loading' : 'ready' }</div>;
  };
}
jest.mock('pages/organizations/developers/developers-view', () => mockProbe());
jest.mock('pages/search/api-documentation/api-documentation-view', () => mockProbe());
jest.mock('pages/search/banned-developers/banned-developers-view', () => mockProbe());
jest.mock('pages/search/corrective-action/corrective-action-view', () => mockProbe());
jest.mock('pages/search/decertified-products/decertified-products-view', () => mockProbe());
jest.mock('pages/search/decision-support-interventions/decision-support-interventions-view', () => mockProbe());
jest.mock('pages/search/inactive-certificates/inactive-certificates-view', () => mockProbe());
jest.mock('pages/search/sed/sed-view', () => mockProbe());
jest.mock('pages/search/svap/svap-view', () => mockProbe());

const loading = { data: undefined, isLoading: true, isSuccess: false };
const loaded = (data) => ({ data, isLoading: false, isSuccess: true });

const pages = [
  ['Developers', ChplDevelopersPage, ['acbs', 'criteria']],
  ['API Documentation', ChplApiDocumentationSearchPage, ['acbs', 'criteria']],
  ['Banned Developers', ChplBannedDevelopersSearchPage, ['acbs']],
  ['Corrective Action', ChplCorrectiveActionSearchPage, ['acbs', 'criteria']],
  ['Decertified Products', ChplDecertifiedProductsSearchPage, ['acbs', 'criteria']],
  ['Decision Support Interventions', ChplDecisionSupportInterventionsSearchPage, ['acbs', 'criteria']],
  ['Inactive Certificates', ChplInactiveCertificatesSearchPage, ['acbs', 'criteria']],
  ['SED', ChplSedSearchPage, ['acbs']],
  ['SVAP', ChplSvapSearchPage, ['acbs', 'criteria', 'svaps']],
];

const mockQueries = (stillLoading) => {
  useFetchAcbs.mockReturnValue(stillLoading === 'acbs' ? loading : loaded({ acbs: [] }));
  useFetchCriteria.mockReturnValue(stillLoading === 'criteria' ? loading : loaded([]));
  useFetchSvaps.mockReturnValue(stillLoading === 'svaps' ? loading : loaded([]));
};

// Pages keep their filter and table state in redux, and the search result
// controls read which widget is open from it
const store = () => configureStore({ reducer: { pageState: pageStateReducer, widget: widgetReducer } });

const renderPage = (Page) => render(
  <Provider store={store()}>
    <UserContext.Provider value={{ hasAnyRole: () => false }}>
      <Page />
    </UserContext.Provider>
  </Provider>,
);

describe('the filter bar on search pages', () => {
  describe.each(pages)('on %s', (_name, Page, queries) => {
    it.each(queries)('waits while the %s filter options load', (query) => {
      mockQueries(query);
      renderPage(Page);

      expect(screen.getByTestId('filters')).toHaveTextContent('loading');
    });

    it('is ready once every filter option has loaded', () => {
      mockQueries(null);
      renderPage(Page);

      expect(screen.getByTestId('filters')).toHaveTextContent('ready');
    });
  });
});

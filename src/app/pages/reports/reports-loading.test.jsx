import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import ChplActivityView from './activity/activity-view';
import ChplQuestionableActivityView from './questionable-activity/questionable-activity-view';

import { useFetchActivity, useFetchQuestionableActivity } from 'api/questionable-activity';
import widgetReducer from 'components/action-widget/widget.slice';
import { FilterProvider } from 'components/filter';
import pageStateReducer from 'components/page-state/pageState.slice';

jest.mock('api/axios', () => ({ useFreshAccessToken: () => jest.fn() }));
jest.mock('api/questionable-activity', () => ({
  useFetchActivity: jest.fn(),
  useFetchQuestionableActivity: jest.fn(),
}));
// Each card's details dialog fetches its own activity; only the list is under test
jest.mock('./activity/activity-details', () => () => null);
jest.mock('components/activity/questionable-activity-details', () => () => null);

const loading = { data: undefined, isError: false, isLoading: true };

const renderReport = (view, { filtersAreLoading = false } = {}) => render(
  <Provider store={configureStore({
    reducer: { browserInfo: () => ({ api: '', apiKey: '' }), pageState: pageStateReducer, widget: widgetReducer },
  })}
  >
    <FilterProvider filters={[]} isLoading={filtersAreLoading} storageKey="test-report">
      { view }
    </FilterProvider>
  </Provider>,
);

beforeEach(() => {
  sessionStorage.clear();
});

describe('the activity report', () => {
  it('shows a skeleton of the activity cards while the activity loads', () => {
    useFetchActivity.mockReturnValue(loading);
    renderReport(<ChplActivityView />);

    expect(screen.getByText('Loading results')).toBeInTheDocument();
  });

  it('keeps the results a skeleton while the filters load', () => {
    useFetchActivity.mockReturnValue({
      data: {
        recordCount: 1,
        results: [{
          id: 1, username: 'pat', concept: 'LISTING', activityDate: 1700000000000,
        }],
      },
      isError: false,
      isLoading: false,
    });
    renderReport(<ChplActivityView />, { filtersAreLoading: true });

    expect(screen.getByText('Loading results')).toBeInTheDocument();
    expect(screen.queryByText('pat')).not.toBeInTheDocument();
  });

  it('still shows the activity once everything has loaded', () => {
    useFetchActivity.mockReturnValue({
      data: {
        recordCount: 1,
        results: [{
          id: 1, username: 'pat', concept: 'LISTING', activityDate: 1700000000000,
        }],
      },
      isError: false,
      isLoading: false,
    });
    renderReport(<ChplActivityView />);

    expect(screen.queryByText('Loading results')).not.toBeInTheDocument();
    expect(screen.getByText('pat')).toBeInTheDocument();
  });
});

describe('the questionable activity report', () => {
  it('shows a skeleton of the activity cards while the activity loads', () => {
    useFetchQuestionableActivity.mockReturnValue(loading);
    renderReport(<ChplQuestionableActivityView />);

    expect(screen.getByText('Loading results')).toBeInTheDocument();
  });

  it('still shows the activity once it has loaded', () => {
    useFetchQuestionableActivity.mockReturnValue({
      data: {
        recordCount: 1,
        results: [{
          id: 1, developerName: 'Some Developer', productName: 'A Product', triggerName: 'Updated', activityDate: 1700000000000,
        }],
      },
      isError: false,
      isLoading: false,
    });
    renderReport(<ChplQuestionableActivityView />);

    expect(screen.queryByText('Loading results')).not.toBeInTheDocument();
    expect(screen.getByText('A Product')).toBeInTheDocument();
  });
});

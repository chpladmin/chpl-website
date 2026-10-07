import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import {
  fireEvent, render, screen, within,
} from '@testing-library/react';
import { Provider } from 'react-redux';

import { filters } from './targeted-users';
import ChplTargetedUsersView from './targeted-users-view';

import { useFetchTargetedUsers } from 'api/standards';
import browserInfoReducer from 'components/browser/browserInfo.slice';
import { FilterProvider } from 'components/filter';

jest.mock('api/standards', () => ({
  useFetchTargetedUsers: jest.fn(),
}));

// Deliberately not in display order, to show the view reorders them
const certificationStatuses = [
  { id: 8, name: 'Retired' },
  { id: 1, name: 'Active' },
  { id: 6, name: 'Withdrawn by ONC-ACB' },
  { id: 2, name: 'Suspended by ONC' },
  { id: 7, name: 'Withdrawn by Developer' },
  { id: 3, name: 'Suspended by ONC-ACB' },
  { id: 5, name: 'Withdrawn by Developer Under Surveillance/Review' },
  { id: 4, name: 'Terminated by ONC' },
];

const displayOrder = [
  'Active',
  'Suspended by ONC',
  'Suspended by ONC-ACB',
  'Terminated by ONC',
  'Withdrawn by Developer Under Surveillance/Review',
  'Withdrawn by ONC-ACB',
  'Withdrawn by Developer',
  'Retired',
];

const targetedUsers = [
  {
    id: 1,
    name: 'beta',
    creationDate: '2019-02-12',
    usage: [
      { certificationStatus: 'Active', listingCount: 3 },
      { certificationStatus: 'Retired', listingCount: 2 },
    ],
  },
  {
    id: 2, name: 'Alpha', creationDate: '2024-12-30', usage: [{ certificationStatus: 'Active', listingCount: 1 }],
  },
  {
    id: 3, name: 'gamma', creationDate: '2020-06-01', usage: [],
  },
];

const respondWith = (results = targetedUsers, recordCount = results.length) => {
  useFetchTargetedUsers.mockReturnValue({
    data: {
      pageNumber: 0, pageSize: 25, recordCount, results,
    },
    isError: false,
    isLoading: false,
  });
};

const lastRequest = () => useFetchTargetedUsers.mock.calls[useFetchTargetedUsers.mock.calls.length - 1][0];

const cardFor = (name) => screen.getByText(name).closest('.MuiCard-root');

// Each field renders its label and then its value
const fieldValue = (card, label) => within(card).getByText(label).closest('div').parentElement.lastChild.textContent;

const store = configureStore({
  reducer: { browserInfo: browserInfoReducer },
  preloadedState: { browserInfo: { api: '/rest', apiKey: 'test-key' } },
});

const renderView = () => render(
  <Provider store={store}>
    <FilterProvider filters={filters} storageKey="test-targetedUsers">
      <ChplTargetedUsersView certificationStatuses={certificationStatuses} />
    </FilterProvider>
  </Provider>,
);

const chooseSort = (text) => {
  fireEvent.click(screen.getByRole('button', { name: /^(Name|Total Listings|Creation Date)$/ }));
  fireEvent.click(screen.getByRole('menuitem', { name: text }));
};

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  useFetchTargetedUsers.mockReset();
  respondWith();
});

describe('the targeted users cards', () => {
  it('shows a count for every status, zeros included, and a total', () => {
    renderView();
    const beta = cardFor('beta');
    expect(fieldValue(beta, 'Total Listings')).toBe('5');
    expect(fieldValue(beta, 'Active')).toBe('3');
    expect(fieldValue(beta, 'Retired')).toBe('2');
    expect(fieldValue(beta, 'Suspended by ONC')).toBe('0');
  });

  it('lists the statuses in the certification status filter order', () => {
    renderView();
    const labels = within(cardFor('beta')).getAllByText(new RegExp(`^(${displayOrder.map((s) => s.replace(/[/-]/g, '\\$&')).join('|')})$`))
      .map((el) => el.textContent);
    expect(labels).toEqual(displayOrder);
  });

  it('shows the total and creation date in the title row, apart from the statuses', () => {
    renderView();
    const card = cardFor('beta');
    expect(fieldValue(card, 'Creation Date')).toBe('Feb 12, 2019');
    const titleLabel = within(card).getByText('Targeted User');
    ['Total Listings', 'Creation Date'].forEach((label) => {
      let shared = within(card).getByText(label).parentElement;
      while (!shared.contains(titleLabel)) { shared = shared.parentElement; }
      // The closest element holding both the title and this field holds no status
      expect(within(shared).queryByText('Active')).not.toBeInTheDocument();
      expect(within(shared).getByText('beta')).toBeInTheDocument();
    });
  });

  it('shows targeted users no listing uses, with all zeros', () => {
    renderView();
    const gamma = cardFor('gamma');
    expect(fieldValue(gamma, 'Total Listings')).toBe('0');
    displayOrder.forEach((status) => expect(fieldValue(gamma, status)).toBe('0'));
  });

  it('warns about usage whose status matches nothing, but still counts it in the total', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    respondWith([{
      id: 4, name: 'delta', creationDate: '2020-01-01', usage: [{ certificationStatus: 'WithdrawnByDeveloper', listingCount: 4 }],
    }]);
    renderView();
    expect(warn).toHaveBeenCalledWith(
      'Targeted User usage has an unknown certification status',
      { targetedUser: 'delta', certificationStatus: 'WithdrawnByDeveloper', listingCount: 4 },
    );
    expect(fieldValue(cardFor('delta'), 'Total Listings')).toBe('4');
    expect(fieldValue(cardFor('delta'), 'Withdrawn by Developer')).toBe('0');
    warn.mockRestore();
  });

  it('shows the cards in the order the server returned them', () => {
    renderView();
    expect(screen.getAllByText(/^(Alpha|beta|gamma)$/).map((el) => el.textContent))
      .toEqual(['beta', 'Alpha', 'gamma']);
  });
});

describe('searching the targeted users', () => {
  it('asks for the first 25, by name ascending, by default', () => {
    renderView();
    expect(lastRequest()).toEqual({
      orderBy: 'NAME', pageNumber: 0, pageSize: 25, sortDescending: false, query: '',
    });
  });

  it('shows which matches are on this page, out of the total', () => {
    respondWith(targetedUsers, 120);
    renderView();
    expect(screen.getByText('Search Results:')).toBeInTheDocument();
    expect(screen.getByText('(1-25 of 120 Results)')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    expect(screen.getByText('(26-50 of 120 Results)')).toBeInTheDocument();
  });

  it('ends the range at the total on the last page', () => {
    sessionStorage.setItem('storageKey-targetedUsersView-pageNumber', JSON.stringify(4));
    respondWith(targetedUsers, 120);
    renderView();
    expect(screen.getByText('(101-120 of 120 Results)')).toBeInTheDocument();
  });

  it('always says Results, even for a single match', () => {
    respondWith([targetedUsers[0]], 1);
    renderView();
    expect(screen.getByText('(1-1 of 1 Results)')).toBeInTheDocument();
  });

  it('says no results were found when nothing matches', () => {
    respondWith([], 0);
    renderView();
    expect(screen.getByText('Search Results:')).toBeInTheDocument();
    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(screen.queryByText(/ Results\)$/)).not.toBeInTheDocument();
  });

  it('offers Name, Total Listings and Creation Date as sort options', () => {
    renderView();
    fireEvent.click(screen.getByRole('button', { name: 'Name' }));
    expect(screen.getAllByRole('menuitem').map((el) => el.textContent)).toEqual(['Name', 'Total Listings', 'Creation Date']);
  });

  it('sorts by creation date on the server, in either direction', () => {
    renderView();
    chooseSort('Creation Date');
    expect(lastRequest()).toMatchObject({ orderBy: 'CREATION_DATE', sortDescending: false });
    fireEvent.click(screen.getByRole('button', { name: 'Sort descending' }));
    expect(lastRequest()).toMatchObject({ orderBy: 'CREATION_DATE', sortDescending: true });
  });

  it('sorts by usage count on the server, in either direction', () => {
    renderView();
    chooseSort('Total Listings');
    expect(lastRequest()).toMatchObject({ orderBy: 'USAGE_COUNT', sortDescending: false });
    fireEvent.click(screen.getByRole('button', { name: 'Sort descending' }));
    expect(lastRequest()).toMatchObject({ orderBy: 'USAGE_COUNT', sortDescending: true });
  });

  it('goes back to the first page when the sort changes', () => {
    respondWith(targetedUsers, 120);
    renderView();
    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    expect(lastRequest()).toMatchObject({ pageNumber: 1 });
    chooseSort('Total Listings');
    expect(lastRequest()).toMatchObject({ orderBy: 'USAGE_COUNT', pageNumber: 0 });
  });

  it('searches by name on the server, from the first page', () => {
    respondWith(targetedUsers, 120);
    renderView();
    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    fireEvent.change(screen.getByPlaceholderText('Search by Name...'), { target: { value: 'clin' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(lastRequest()).toMatchObject({ query: 'searchTerm=clin', pageNumber: 0 });
  });

  it('keeps a page remembered from earlier in the session', () => {
    sessionStorage.setItem('storageKey-targetedUsersView-pageNumber', JSON.stringify(2));
    respondWith(targetedUsers, 120);
    renderView();
    expect(lastRequest()).toMatchObject({ pageNumber: 2 });
  });
});

describe('the targeted users filters', () => {
  const queryFor = (key, values) => {
    const filter = filters.find((f) => f.key === key);
    return filter.getQuery({ ...filter, values });
  };

  it('sends isUsed for the Used filter choice', () => {
    expect(queryFor('isUsed', [{ value: 'true', selected: true }])).toBe('isUsed=true');
    expect(queryFor('isUsed', [{ value: 'false', selected: true }])).toBe('isUsed=false');
  });

  it('sends the creation date range as start and end dates', () => {
    expect(queryFor('creationDate', [
      { value: 'Before', selected: '2024-12-31' },
      { value: 'After', selected: '2024-01-01' },
    ])).toBe('creationDateStart=2024-01-01&creationDateEnd=2024-12-31');
  });
});

describe('downloading the targeted users', () => {
  let open;
  beforeEach(() => { open = jest.spyOn(window, 'open').mockImplementation(() => {}); });
  afterEach(() => open.mockRestore());

  const downloadButton = () => screen.queryByRole('button', { name: /^Download information for/ });

  it('offers to download every match, not just this page', () => {
    respondWith(targetedUsers, 120);
    renderView();
    expect(downloadButton()).toHaveTextContent('Download information for 120 Targeted Users');
  });

  it('says Targeted User for a single match', () => {
    respondWith([targetedUsers[0]], 1);
    renderView();
    expect(downloadButton()).toHaveTextContent('Download information for 1 Targeted User');
  });

  it('is hidden when nothing matches', () => {
    respondWith([], 0);
    renderView();
    expect(downloadButton()).not.toBeInTheDocument();
  });

  it('downloads with the API key and the current search, and no sign-in token', () => {
    respondWith(targetedUsers, 120);
    renderView();
    fireEvent.click(downloadButton());
    expect(open).toHaveBeenLastCalledWith('/rest/targeted-users/download?api_key=test-key&');

    fireEvent.change(screen.getByPlaceholderText('Search by Name...'), { target: { value: 'clin' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    fireEvent.click(downloadButton());
    expect(open).toHaveBeenLastCalledWith('/rest/targeted-users/download?api_key=test-key&searchTerm=clin');
    expect(open.mock.calls.every(([url]) => !url.includes('authorization'))).toBe(true);
  });
});

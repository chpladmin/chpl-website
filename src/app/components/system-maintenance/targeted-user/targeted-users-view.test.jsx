import React from 'react';
import {
  fireEvent, render, screen, within,
} from '@testing-library/react';

import ChplTargetedUsersView from './targeted-users-view';

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
    usage: [
      { certificationStatus: 'Active', listingCount: 3 },
      { certificationStatus: 'Retired', listingCount: 2 },
    ],
  },
  { id: 2, name: 'Alpha', usage: [{ certificationStatus: 'Active', listingCount: 1 }] },
  { id: 3, name: 'gamma', usage: [] },
];

const names = /^(Alpha|beta|gamma)$/;
const renderedNames = () => screen.getAllByText(names).map((el) => el.textContent);
const cardFor = (name) => screen.getByText(name).closest('.MuiCard-root');

// Each field renders its label and then its value
const fieldValue = (card, label) => within(card).getByText(label).closest('div').parentElement.lastChild.textContent;

const renderView = (users = targetedUsers) => render(
  <ChplTargetedUsersView certificationStatuses={certificationStatuses} targetedUsers={users} />,
);

describe('the targeted users view', () => {
  it('shows a count for every status, zeros included, and a total', () => {
    renderView();
    const beta = cardFor('beta');
    expect(fieldValue(beta, 'Total Listings')).toBe('5');
    expect(fieldValue(beta, 'Active')).toBe('3');
    expect(fieldValue(beta, 'Retired')).toBe('2');
    expect(fieldValue(beta, 'Suspended by ONC')).toBe('0');
  });

  it('shows the total in the title row, apart from the statuses', () => {
    renderView();
    const card = cardFor('beta');
    const totalLabel = within(card).getByText('Total Listings');
    const titleLabel = within(card).getByText('Targeted User');
    let shared = totalLabel.parentElement;
    while (!shared.contains(titleLabel)) { shared = shared.parentElement; }
    // The closest element holding both the title and the total holds no status
    expect(within(shared).queryByText('Active')).not.toBeInTheDocument();
    expect(within(shared).getByText('beta')).toBeInTheDocument();
  });

  it('lists the statuses in the certification status filter order', () => {
    renderView();
    const labels = within(cardFor('beta')).getAllByText(new RegExp(`^(${displayOrder.map((s) => s.replace(/[/-]/g, '\\$&')).join('|')})$`))
      .map((el) => el.textContent);
    expect(labels).toEqual(displayOrder);
  });

  it('shows targeted users no listing uses, with all zeros', () => {
    renderView();
    const gamma = cardFor('gamma');
    expect(fieldValue(gamma, 'Total Listings')).toBe('0');
    displayOrder.forEach((status) => expect(fieldValue(gamma, status)).toBe('0'));
  });

  it('warns about usage whose status matches nothing, but still counts it in the total', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    renderView([{ id: 4, name: 'delta', usage: [{ certificationStatus: 'WithdrawnByDeveloper', listingCount: 4 }] }]);
    expect(warn).toHaveBeenCalledWith(
      'Targeted User usage has an unknown certification status',
      { targetedUser: 'delta', certificationStatus: 'WithdrawnByDeveloper', listingCount: 4 },
    );
    expect(fieldValue(cardFor('delta'), 'Total Listings')).toBe('4');
    expect(fieldValue(cardFor('delta'), 'Withdrawn by Developer')).toBe('0');
    warn.mockRestore();
  });

  it('sorts by name ignoring case by default', () => {
    renderView();
    expect(renderedNames()).toEqual(['Alpha', 'beta', 'gamma']);
  });

  it('sorts by total, breaking ties by name, in either direction', () => {
    renderView([...targetedUsers, { id: 4, name: 'Aardvark', usage: [] }]);
    fireEvent.click(screen.getByText('Name'));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Total Listings' }));
    expect(screen.getAllByText(/^(Aardvark|Alpha|beta|gamma)$/).map((el) => el.textContent))
      .toEqual(['Aardvark', 'gamma', 'Alpha', 'beta']);

    fireEvent.click(screen.getByRole('button', { name: 'Sort descending' }));
    expect(screen.getAllByText(/^(Aardvark|Alpha|beta|gamma)$/).map((el) => el.textContent))
      .toEqual(['beta', 'Alpha', 'Aardvark', 'gamma']);
  });

  it('offers name, total and every status as sort options', () => {
    renderView();
    fireEvent.click(screen.getByText('Name'));
    expect(screen.getAllByRole('menuitem').map((el) => el.textContent))
      .toEqual(['Name', 'Total Listings', ...displayOrder]);
  });
});

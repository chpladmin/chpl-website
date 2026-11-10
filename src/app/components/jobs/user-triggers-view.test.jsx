import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import ChplUserTriggersView from './user-triggers-view';

const acbs = Object.freeze([
  Object.freeze({ id: 1, name: 'Drummond Group', retired: true }),
  Object.freeze({ id: 2, name: 'ICSA Labs', retired: false }),
]);

// Frozen, so any in-place sort of the props throws
const trigger = (name, email, jobName, acb) => Object.freeze({
  name,
  email,
  acb,
  cronSchedule: '0 0 4 * * ?',
  job: Object.freeze({ name: jobName }),
});
const triggers = Object.freeze([
  trigger('Report B', 'b@example.com', 'Alpha type'),
  trigger('Report A', 'a@example.com', 'Gamma type', '2,1'),
  trigger('Report C', 'c@example.com', 'Beta type'),
]);

const reportNames = () => screen.getAllByRole('button', { name: /^Edit Report / })
  .map((button) => button.getAttribute('aria-label').replace('Edit Report ', ''));

const sortByType = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Email' }));
  fireEvent.click(screen.getByRole('menuitem', { name: 'Type' }));
};

describe('the scheduled reports list', () => {
  it('starts sorted by email, and lists each ONC-ACB in name order', () => {
    render(<ChplUserTriggersView acbs={acbs} triggers={triggers} />);

    expect(reportNames()).toEqual(['Report A', 'Report B', 'Report C']);
    expect(screen.getByText('Drummond Group (Retired), ICSA Labs')).toBeInTheDocument();
  });

  it('re-sorts by the chosen option, without reordering the props', () => {
    render(<ChplUserTriggersView acbs={acbs} triggers={triggers} />);
    sortByType();

    expect(reportNames()).toEqual(['Report B', 'Report C', 'Report A']);
    expect(triggers.map((t) => t.name)).toEqual(['Report B', 'Report A', 'Report C']);
  });

  it('shows triggers fetched again in the chosen sort, matching the sort control', () => {
    const { rerender } = render(<ChplUserTriggersView acbs={acbs} triggers={triggers} />);
    sortByType();
    fireEvent.click(screen.getByRole('button', { name: 'Sort descending' }));
    rerender(<ChplUserTriggersView acbs={acbs} triggers={[...triggers.slice(1), trigger('Report D', 'd@example.com', 'Delta type')]} />);

    expect(reportNames()).toEqual(['Report A', 'Report D', 'Report C']);
    expect(screen.getByRole('button', { name: 'Type' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sort ascending' })).toBeInTheDocument();
  });
});

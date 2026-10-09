import React from 'react';
import {
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';

import ChplReportJobTypesView from './report-job-types-view';

// Frozen, so any in-place sort of the props throws
const jobTypes = Object.freeze([
  Object.freeze({ name: 'beta report', description: 'B', jobDataMap: Object.freeze({ acbSpecific: false }) }),
  Object.freeze({ name: 'Alpha report', description: 'A', jobDataMap: Object.freeze({ acbSpecific: true }) }),
  Object.freeze({ name: 'Gamma report', description: 'G', jobDataMap: Object.freeze({ acbSpecific: false }) }),
]);

const rowNames = () => screen.getAllByRole('row').slice(1).map((row) => within(row).getAllByRole('cell')[0].textContent);

describe('the report types table', () => {
  it('starts sorted by name, ignoring case', () => {
    render(<ChplReportJobTypesView jobTypes={jobTypes} dispatch={jest.fn()} />);
    expect(rowNames()).toEqual(['Alpha report', 'beta report', 'Gamma report']);
  });

  it('re-sorts when a column header is clicked, without reordering the props', () => {
    render(<ChplReportJobTypesView jobTypes={jobTypes} dispatch={jest.fn()} />);
    fireEvent.click(screen.getByText('Report Name'));
    expect(rowNames()).toEqual(['Gamma report', 'beta report', 'Alpha report']);
    fireEvent.click(screen.getByText('Report Name'));
    expect(rowNames()).toEqual(['Alpha report', 'beta report', 'Gamma report']);
    expect(jobTypes.map((j) => j.name)).toEqual(['beta report', 'Alpha report', 'Gamma report']);
  });
});

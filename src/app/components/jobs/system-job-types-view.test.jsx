import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import ChplSystemJobTypesView from './system-job-types-view';

// Frozen, so any in-place sort of the props throws
const job = (name) => Object.freeze({ name, description: `${name} description`, group: 'systemJobs' });
const jobTypes = Object.freeze([job('beta job'), job('Alpha job'), job('Gamma job')]);

const jobNames = () => screen.getAllByRole('button', { name: /^Schedule Job / })
  .map((button) => button.getAttribute('aria-label').replace('Schedule Job ', ''));

describe('the system job types list', () => {
  it('starts sorted by name, ignoring case', () => {
    render(<ChplSystemJobTypesView jobTypes={jobTypes} dispatch={jest.fn()} />);
    expect(jobNames()).toEqual(['Alpha job', 'beta job', 'Gamma job']);
  });

  it('re-sorts when the direction is toggled, without reordering the props', () => {
    render(<ChplSystemJobTypesView jobTypes={jobTypes} dispatch={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Sort descending' }));
    expect(jobNames()).toEqual(['Gamma job', 'beta job', 'Alpha job']);
    expect(jobTypes.map((j) => j.name)).toEqual(['beta job', 'Alpha job', 'Gamma job']);
  });

  it('shows job types fetched again, keeping the chosen sort', () => {
    const { rerender } = render(<ChplSystemJobTypesView jobTypes={jobTypes} dispatch={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Sort descending' }));
    rerender(<ChplSystemJobTypesView jobTypes={[...jobTypes, job('Delta job')]} dispatch={jest.fn()} />);

    expect(jobNames()).toEqual(['Gamma job', 'Delta job', 'beta job', 'Alpha job']);
    expect(screen.getByRole('button', { name: 'Sort ascending' })).toBeInTheDocument();
  });
});

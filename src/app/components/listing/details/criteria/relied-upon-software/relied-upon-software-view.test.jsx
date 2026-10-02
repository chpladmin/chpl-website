import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplReliedUponSoftwareView from './relied-upon-software-view';

describe('the relied upon software view', () => {
  it('shows every ungrouped item, not just the last one', () => {
    render(
      <ChplReliedUponSoftwareView sw={[
        { id: 1, grouping: null, name: 'Alpha' },
        { id: 2, grouping: null, name: 'Beta' },
        { id: 3, grouping: null, name: 'Gamma' },
      ]}
      />,
    );

    expect(screen.getByText(/Alpha/)).toBeInTheDocument();
    expect(screen.getByText(/Beta/)).toBeInTheDocument();
    expect(screen.getByText(/Gamma/)).toBeInTheDocument();
  });

  it('collects items sharing a grouping under "One of"', () => {
    render(
      <ChplReliedUponSoftwareView sw={[
        { id: 1, grouping: 'a', name: 'Alpha' },
        { id: 2, grouping: 'a', name: 'Beta' },
        { id: 3, grouping: null, name: 'Gamma' },
      ]}
      />,
    );

    expect(screen.getAllByText(/One of/)).toHaveLength(1);
    expect(screen.getByText(/Alpha/)).toBeInTheDocument();
    expect(screen.getByText(/Beta/)).toBeInTheDocument();
    expect(screen.getByText(/Gamma/)).toBeInTheDocument();
  });
});

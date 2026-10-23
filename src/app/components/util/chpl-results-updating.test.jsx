import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplResultsUpdating from './chpl-results-updating';

const renderResults = (isUpdating) => render(
  <ChplResultsUpdating isUpdating={isUpdating}>
    <div>Result card</div>
  </ChplResultsUpdating>,
);

describe('results while they update', () => {
  it('keeps the results on screen, and announces nothing, when nothing is updating', () => {
    renderResults(false);

    expect(screen.getByText('Result card')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('');
    expect(screen.getByText('Result card').parentElement).toHaveAttribute('aria-busy', 'false');
  });

  it('keeps the old results on screen, marked busy, and announces the update', () => {
    renderResults(true);

    expect(screen.getByText('Result card')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Updating results');
    expect(screen.getByText('Result card').parentElement).toHaveAttribute('aria-busy', 'true');
  });
});

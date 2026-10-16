import React from 'react';
import { render, screen } from '@testing-library/react';

import { ChplCompareLoading } from './compare';

const headerCells = (container) => container.querySelectorAll('thead th');

describe('the compare skeleton', () => {
  it('announces that the products are loading', () => {
    render(<ChplCompareLoading products={3} />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading products to compare');
  });

  it('draws the data item column and one column per product', () => {
    const { container } = render(<ChplCompareLoading products={3} />);
    expect(headerCells(container)).toHaveLength(1 + 3);
  });

  it('draws at least one product column', () => {
    const { container } = render(<ChplCompareLoading products={0} />);
    expect(headerCells(container)).toHaveLength(1 + 1);
  });

  it('frames the table in a skeleton card, not a real one', () => {
    const { container } = render(<ChplCompareLoading products={2} />);
    expect(container.querySelector('.MuiCard-root')).toBeNull();
    expect(container.querySelector('table')).not.toBeNull();
  });
});

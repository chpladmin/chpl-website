import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplComparePage, { ChplCompareLoading } from './compare';

import { useFetchListing } from 'api/listing';

jest.mock('api/listing', () => ({ useFetchListing: jest.fn() }));
jest.mock('components/browser/browser-compared-widget', () => () => null);
jest.mock('components/cms-widget/cms-button', () => () => null);
jest.mock('services/navigation.service', () => ({ goToState: jest.fn(), goToUrl: jest.fn() }));

const listing = (id, product, version, certificationDay) => ({
  id,
  chplProductNumber: `CHP-${id}`,
  product: { id, name: product },
  version: { id, version },
  developer: { id, name: `Developer ${id}` },
  currentStatus: { status: { name: 'Active' } },
  practiceType: {},
  certifyingBody: { name: 'ACB' },
  certificationDay,
  certificationDate: Date.parse(`${certificationDay}T00:00:00Z`),
  decertificationDay: null,
  countOpenNonconformities: 0,
  countCerts: 0,
  countCqms: 0,
  certificationResults: [],
  cqmResults: [],
});

const listings = {
  11: listing(11, 'zeta', '1', '2018-01-01'),
  12: listing(12, 'Alpha', 'v10', '2024-01-01'),
  13: listing(13, 'Alpha', 'v9', '2023-01-01'),
  14: listing(14, 'alpha', 'v9', '2020-06-01'),
};

beforeEach(() => {
  useFetchListing.mockImplementation(({ id }) => (id
    ? { data: listings[id], isLoading: false, isSuccess: true }
    : { data: undefined, isLoading: false, isSuccess: false }));
});

const productColumns = () => screen.getAllByText(/^CHP-\d+$/).map((el) => el.textContent);
const headerCells = (container) => container.querySelectorAll('thead th');

describe('the compare page', () => {
  it('shows a column for each listing in the URL', async () => {
    render(<ChplComparePage ids="11&12" />);
    expect(await screen.findByText('CHP-11')).toBeInTheDocument();
    expect(screen.getByText('CHP-12')).toBeInTheDocument();
  });

  it('orders the columns like the compare widget: product name, then version, then earliest certification', async () => {
    render(<ChplComparePage ids="11&12&13&14" />);
    await screen.findByText('CHP-14');
    expect(productColumns()).toEqual(['CHP-14', 'CHP-13', 'CHP-12', 'CHP-11']);
  });

  it('uses the same order whatever order the ids are in the URL', async () => {
    render(<ChplComparePage ids="14&11&13&12" />);
    await screen.findByText('CHP-12');
    expect(productColumns()).toEqual(['CHP-14', 'CHP-13', 'CHP-12', 'CHP-11']);
  });
});

describe('the compare page while some products are still loading', () => {
  const stillLoading = (...pending) => {
    useFetchListing.mockImplementation(({ id }) => {
      if (pending.includes(id)) { return { data: undefined, isLoading: true, isSuccess: false }; }
      return id
        ? { data: listings[id], isLoading: false, isSuccess: true }
        : { data: undefined, isLoading: false, isSuccess: false };
    });
  };
  const skeletonHeaders = (container) => [...headerCells(container)].filter((th) => th.querySelector('.MuiSkeleton-root'));

  it('shows the whole page skeleton until the first product loads', () => {
    stillLoading('11');
    render(<ChplComparePage ids="11&12" />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading products to compare');
  });

  it('shows the loaded products, then a skeleton column for each one still loading', async () => {
    stillLoading('12');
    const { container } = render(<ChplComparePage ids="11&12&13" />);
    expect(await screen.findByText('CHP-11')).toBeInTheDocument();
    expect(headerCells(container)).toHaveLength(1 + 1 + 2);
    expect(skeletonHeaders(container)).toHaveLength(2);
    expect(headerCells(container)[1].querySelector('.MuiSkeleton-root')).toBeNull();
    expect(container.querySelector('table')).toHaveAttribute('aria-busy', 'true');
  });

  it('puts a skeleton cell in every row of a column still loading', async () => {
    stillLoading('12');
    const { container } = render(<ChplComparePage ids="11&12" />);
    await screen.findByText('CHP-11');
    container.querySelectorAll('tbody tr').forEach((row) => {
      expect(row.querySelectorAll('td')).toHaveLength(1 + 1 + 1);
      expect(row.querySelectorAll('td')[2].querySelector('.MuiSkeleton-root')).not.toBeNull();
    });
  });

  it('drops the skeleton columns once every product has loaded', async () => {
    const { container } = render(<ChplComparePage ids="11&12" />);
    await screen.findByText('CHP-12');
    expect(skeletonHeaders(container)).toHaveLength(0);
    expect(container.querySelector('table')).toHaveAttribute('aria-busy', 'false');
  });
});

describe('the compare skeleton', () => {
  it('announces that the products are loading', () => {
    render(<ChplCompareLoading products={3} />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading products to compare');
  });

  it('draws the data item column and one column per product', () => {
    const { container } = render(<ChplCompareLoading products={3} />);
    expect(headerCells(container)).toHaveLength(1 + 3);
  });

  it('draws 15 rows', () => {
    const { container } = render(<ChplCompareLoading products={2} />);
    expect(container.querySelectorAll('tbody tr')).toHaveLength(15);
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

import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplComparePage, { ChplCompareLoading } from './compare';

import { useFetchListing } from 'api/listing';

const mockEnqueueSnackbar = jest.fn();

jest.mock('api/listing', () => ({ useFetchListing: jest.fn() }));
jest.mock('components/browser/browser-compared-widget', () => () => null);
jest.mock('components/cms-widget/cms-button', () => () => null);
jest.mock('notistack', () => ({
  useSnackbar: () => ({ enqueueSnackbar: mockEnqueueSnackbar }),
}));
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
  mockEnqueueSnackbar.mockClear();
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

// A bad id (removed listing, mistyped link, ...) resolves with an error
// instead of hanging in the loading state forever
describe('the compare page when a product id is invalid', () => {
  const failing = (...badIds) => {
    useFetchListing.mockImplementation(({ id }) => {
      if (badIds.includes(id)) {
        return {
          data: undefined, isError: true, isLoading: false, isSuccess: false,
        };
      }
      return id
        ? { data: listings[id], isLoading: false, isSuccess: true }
        : { data: undefined, isLoading: false, isSuccess: false };
    });
  };

  it('shows the product as not found in its own column instead of the whole-page skeleton', async () => {
    failing('999');
    render(<ChplComparePage ids="999" />);

    expect(await screen.findByText('Not Found')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('gives each invalid id its own not-found column', async () => {
    failing('998', '999');
    const { container } = render(<ChplComparePage ids="998&999" />);

    expect(await screen.findAllByText('Not Found')).toHaveLength(2);
    expect(headerCells(container)).toHaveLength(1 + 2);
  });

  it('explains why, for assistive tech, via the column header\'s tooltip', async () => {
    failing('999');
    render(<ChplComparePage ids="999" />);

    await screen.findByText('Not Found');
    expect(screen.getByLabelText('This product could not be found. It may have been removed, or the link may be incorrect.')).toBeInTheDocument();
  });

  it('notifies about the invalid id', async () => {
    failing('999');
    render(<ChplComparePage ids="999" />);

    await screen.findByText('Not Found');
    expect(mockEnqueueSnackbar).toHaveBeenCalledWith('A selected product could not be found and was skipped.', { variant: 'error' });
  });

  it('keeps the products that loaded beside a not-found column for the one that did not', async () => {
    failing('999');
    const { container } = render(<ChplComparePage ids="11&999" />);

    expect(await screen.findByText('CHP-11')).toBeInTheDocument();
    expect(screen.getByText('Not Found')).toBeInTheDocument();
    expect(headerCells(container)).toHaveLength(1 + 1 + 1);
  });

  it('puts a placeholder cell in every row of a not-found column', async () => {
    failing('999');
    const { container } = render(<ChplComparePage ids="11&999" />);
    await screen.findByText('CHP-11');
    container.querySelectorAll('tbody tr').forEach((row) => {
      const cells = row.querySelectorAll('td');
      expect(cells[cells.length - 1]).toHaveTextContent('—');
    });
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

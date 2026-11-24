import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplCqms from './cqms';

import { ListingContext } from 'shared/contexts';

const edition2015 = { id: 3, name: '2015' };
const edition2014 = { id: 2, name: '2014' };

const cqm = {
  id: 1,
  cmsId: 'CMS2',
  title: 'Preventive Care and Screening',
  description: 'description',
  success: true,
  successVersions: ['v8'],
  criteria: [
    { certificationNumber: '170.315 (c)(1)' },
    { certificationNumber: '170.315 (c)(4)' },
  ],
};

const c4Result = (removed) => ({ criterion: { number: '170.315 (c)(4)', removed } });

const renderCqms = (listing, edition = edition2015) => render(
  <ListingContext.Provider value={{ listing }}>
    <ChplCqms cqms={[cqm]} edition={edition} viewAll={false} />
  </ListingContext.Provider>,
);

describe('the listing CQM panel', () => {
  it('shows the (c)(4) column while (c)(4) is not removed', () => {
    renderCqms({ certificationResults: [c4Result(false)] });

    expect(screen.getByRole('columnheader', { name: '170.315 (c)(4)' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(6);
    expect(screen.getByText(/meets\s*170.315 \(c\)\(\s*4\s*\)/)).toBeInTheDocument();
  });

  it('hides the (c)(4) column, header and cells, once (c)(4) is removed', () => {
    renderCqms({ certificationResults: [c4Result(true)] });

    expect(screen.queryByRole('columnheader', { name: '170.315 (c)(4)' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(5);
    expect(screen.queryByText(/170.315 \(c\)\(\s*4\s*\)/)).not.toBeInTheDocument();
    expect(screen.getAllByRole('cell')).toHaveLength(5);
  });

  it('renders a listing with no (c)(4) result, such as a 2014 listing', () => {
    renderCqms({ certificationResults: [{ criterion: { number: '170.314 (c)(1)', removed: false } }] }, edition2014);

    expect(screen.getByText(/Preventive Care and Screening/)).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
  });

  it('hides the (c)(4) column for a 2015 listing with no (c)(4) result', () => {
    renderCqms({ certificationResults: [] });

    expect(screen.queryByRole('columnheader', { name: '170.315 (c)(4)' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(5);
  });
});

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import ChplCharts from './charts';

import { useFetchReportMetadata } from 'api/reports';

jest.mock('api/reports', () => ({
  useFetchReportMetadata: jest.fn(),
}));

jest.mock('services/analytics.service', () => ({
  eventTrack: jest.fn(),
}));

jest.mock('shared/contexts', () => ({
  useAnalyticsContext: () => ({ analytics: {} }),
}));

const report = { title: 'Listing Counts', height: 800, url: 'https://example.com/listing-counts' };

describe('the charts page', () => {
  it('shows the real header and introduction while the reports load, with skeletons for the reports', () => {
    useFetchReportMetadata.mockReturnValue({ data: undefined, isLoading: true, isSuccess: false });
    render(<ChplCharts />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading charts');
    expect(screen.getByRole('heading', { name: 'Charts' })).toBeInTheDocument();
    expect(screen.getByText('CHPL Charts')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Charts' })).not.toBeInTheDocument();
  });

  it('shows the report menu and tiles once the reports arrive', () => {
    useFetchReportMetadata.mockReturnValue({ data: [report], isLoading: false, isSuccess: true });
    render(<ChplCharts />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Listing Counts' })).toBeInTheDocument();
    expect(screen.getAllByText('Listing Counts')).toHaveLength(2);
  });

  it('holds an opened report behind a skeleton until it loads', () => {
    useFetchReportMetadata.mockReturnValue({ data: [report], isLoading: false, isSuccess: true });
    render(<ChplCharts />);
    fireEvent.click(screen.getByRole('button', { name: 'Listing Counts' }));
    expect(screen.getByRole('status')).toHaveTextContent('Loading Listing Counts');
    fireEvent.load(screen.getByTitle('Listing Counts'));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

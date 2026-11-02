import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import ChplComplianceDashboard from './compliance-dashboard';

import { useFetchReportMetadata } from 'api/reports';

jest.mock('api/reports', () => ({
  useFetchReportMetadata: jest.fn(),
}));

const importantDates = { title: 'Important Dates', height: 400, url: 'https://example.com/dates' };

describe('the compliance dashboard', () => {
  it('shows the real report cards, with a skeleton in each, while the reports load', () => {
    useFetchReportMetadata.mockReturnValue({ data: undefined, isLoading: true, isSuccess: false });
    render(<ChplComplianceDashboard />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading compliance reports');
    expect(screen.getByText('Important Dates')).toBeInTheDocument();
    expect(screen.getByText('Surveillance Activities')).toBeInTheDocument();
    expect(screen.queryByText('This report is not available')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Important Dates')).not.toBeInTheDocument();
  });

  it('shows each report once the reports arrive', () => {
    useFetchReportMetadata.mockReturnValue({ data: [importantDates], isLoading: false, isSuccess: true });
    render(<ChplComplianceDashboard />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByTitle('Important Dates')).toHaveAttribute('src', importantDates.url);
  });

  it('keeps a report hidden behind its skeleton until it loads', () => {
    useFetchReportMetadata.mockReturnValue({ data: [importantDates], isLoading: false, isSuccess: true });
    render(<ChplComplianceDashboard />);
    const report = screen.getByTitle('Important Dates');
    expect(report).toHaveStyle({ visibility: 'hidden' });
    fireEvent.load(report);
    expect(report).not.toHaveStyle({ visibility: 'hidden' });
  });

  it('says a report is unavailable rather than loading it forever', () => {
    useFetchReportMetadata.mockReturnValue({ data: [importantDates], isLoading: false, isSuccess: true });
    render(<ChplComplianceDashboard />);
    expect(screen.getByText('Real World Testing')).toBeInTheDocument();
    expect(screen.getAllByText('This report is not available')).toHaveLength(9);
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplComplianceDashboard from './compliance-dashboard';

import { useFetchReportMetadata } from 'api/reports';

jest.mock('api/reports', () => ({
  useFetchReportMetadata: jest.fn(),
}));

const importantDates = { title: 'Important Dates', height: 400, url: 'https://example.com/dates' };

describe('the compliance dashboard', () => {
  it('shows a skeleton of the report cards, without their titles, while the reports load', () => {
    useFetchReportMetadata.mockReturnValue({ data: undefined, isLoading: true, isSuccess: false });
    render(<ChplComplianceDashboard />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading compliance reports');
    expect(screen.queryByText(/Not yet implemented/)).not.toBeInTheDocument();
    expect(screen.queryByText('Important Dates')).not.toBeInTheDocument();
  });

  it('shows each report once the reports arrive', () => {
    useFetchReportMetadata.mockReturnValue({ data: [importantDates], isLoading: false, isSuccess: true });
    render(<ChplComplianceDashboard />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByTitle('Important Dates')).toHaveAttribute('src', importantDates.url);
  });

  it('says a report is unavailable rather than loading it forever', () => {
    useFetchReportMetadata.mockReturnValue({ data: [importantDates], isLoading: false, isSuccess: true });
    render(<ChplComplianceDashboard />);
    expect(screen.getByText('Real World Testing')).toBeInTheDocument();
    expect(screen.getAllByText('This report is not available')).toHaveLength(9);
  });
});

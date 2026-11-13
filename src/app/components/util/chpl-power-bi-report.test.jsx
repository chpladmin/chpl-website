import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';

import ChplPowerBiReport from './chpl-power-bi-report';

const report = { height: 600, title: 'A Report', url: 'https://example.com/report' };

const renderReport = (announce = true) => render(
  <ChplPowerBiReport height={report.height} title={report.title} url={report.url} announce={announce} />,
);

describe('a PowerBI report', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows a skeleton, and hides the report, until the report loads', () => {
    renderReport();
    expect(screen.getByRole('status')).toHaveTextContent('Loading A Report');
    expect(screen.getByTitle('A Report')).toHaveStyle({ visibility: 'hidden' });
  });

  it('shows the report once it loads', () => {
    renderReport();
    fireEvent.load(screen.getByTitle('A Report'));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByTitle('A Report')).not.toHaveStyle({ visibility: 'hidden' });
    expect(screen.getByTitle('A Report')).toHaveAttribute('src', report.url);
  });

  it('shows the report anyway if it never says it has loaded', () => {
    jest.useFakeTimers();
    renderReport();
    act(() => { jest.advanceTimersByTime(15000); });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByTitle('A Report')).not.toHaveStyle({ visibility: 'hidden' });
  });

  it('does not announce itself where the page announces for it', () => {
    renderReport(false);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByTitle('A Report')).toHaveStyle({ visibility: 'hidden' });
  });
});

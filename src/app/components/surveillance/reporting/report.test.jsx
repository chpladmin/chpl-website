import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplReport from './report';

import { useFetchAnnual, useFetchQuarterly, useFetchQuarters } from 'api/surveillance';

jest.mock('api/surveillance', () => ({
  useFetchAnnual: jest.fn(),
  useFetchQuarterly: jest.fn(),
  useFetchQuarters: jest.fn(),
}));
jest.mock('./annual', () => function ChplAnnual() {
  const mockReact = jest.requireActual('react');
  return mockReact.createElement('div', { 'data-testid': 'annual' });
});
jest.mock('./quarter', () => function ChplQuarter({ quarter }) {
  const mockReact = jest.requireActual('react');
  return mockReact.createElement('div', { 'data-testid': 'quarter' }, quarter.name);
});

const acb = { id: 1, name: 'ICSA Labs' };
const quarters = [{ id: 1, name: 'Q1' }, { id: 2, name: 'Q2' }, { id: 3, name: 'Q3' }, { id: 4, name: 'Q4' }];
const loaded = (data) => ({ data, isLoading: false, isSuccess: true });
const loading = { data: undefined, isLoading: true, isSuccess: false };

const renderReport = () => render(<ChplReport acb={acb} dispatch={() => {}} />);

describe('the surveillance report for an ONC-ACB', () => {
  beforeEach(() => {
    useFetchAnnual.mockReturnValue(loaded([{ acb, year: 2026 }]));
    useFetchQuarters.mockReturnValue(loaded(quarters));
    useFetchQuarterly.mockReturnValue(loaded([{ acb, year: 2026, quarter: 'Q1' }]));
  });

  it('shows a skeleton of its cards, and none of the real ones, while any part of it loads', () => {
    useFetchQuarterly.mockReturnValue(loading);
    renderReport();

    expect(screen.getByRole('status')).toHaveTextContent('Loading surveillance reports');
    expect(screen.queryByText('ICSA Labs')).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('quarter')).toHaveLength(0);
  });

  it('shows the year, each quarter and the annual report once it has loaded', () => {
    renderReport();

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('ICSA Labs')).toBeInTheDocument();
    expect(screen.getAllByTestId('quarter').map((q) => q.textContent)).toEqual(['Q1', 'Q2', 'Q3', 'Q4']);
    expect(screen.getByTestId('annual')).toBeInTheDocument();
  });

  // It used to wait for every part to be non-empty, so a year without any
  // reports yet never got past its spinner
  it('still shows the cards when no reports have been started', () => {
    useFetchAnnual.mockReturnValue(loaded([]));
    useFetchQuarterly.mockReturnValue(loaded([]));
    renderReport();

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('quarter')).toHaveLength(4);
    expect(screen.getByTestId('annual')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplSurveillanceReporting from './reporting';

import { useFetchAcbs } from 'api/acbs';

jest.mock('api/acbs', () => ({
  useFetchAcbs: jest.fn(),
}));
jest.mock('components/surveillance/reporting/report', () => function ChplReport({ acb }) {
  const mockReact = jest.requireActual('react');
  return mockReact.createElement('div', { 'data-testid': 'report' }, acb.name);
});

const respondWith = (acbs) => useFetchAcbs.mockReturnValue({ data: { acbs }, isLoading: false, isSuccess: true });

const acbButtonNames = () => screen.queryAllByRole('button')
  .filter((button) => button.id.startsWith('acb-navigation-'))
  .map((button) => button.id.replace('acb-navigation-', ''));

describe('the surveillance reporting page', () => {
  it('lists active ONC-ACBs first, then retired ones, each by name ignoring case', () => {
    // Deliberately in neither order, as the API may return them
    respondWith([
      { id: 1, name: 'SLI Compliance', retired: true },
      { id: 2, name: 'ICSA Labs' },
      { id: 3, name: 'drummond group' },
      { id: 4, name: 'Leidos', retired: true },
      { id: 5, name: 'Drummond Group', retired: true },
    ]);
    render(<ChplSurveillanceReporting />);

    expect(acbButtonNames()).toEqual(['drummond group', 'ICSA Labs', 'Drummond Group', 'Leidos', 'SLI Compliance']);
  });

  it('opens the report directly when there is only one ONC-ACB', () => {
    respondWith([{ id: 1, name: 'ICSA Labs' }]);
    render(<ChplSurveillanceReporting />);

    expect(acbButtonNames()).toEqual([]);
    expect(screen.getByTestId('report')).toHaveTextContent('ICSA Labs');
  });
});

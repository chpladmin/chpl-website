import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplSurveillanceReporting from './reporting';

import { useFetchAcbs } from 'api/acbs';
import { UserContext } from 'shared/contexts';

jest.mock('api/acbs', () => ({
  useFetchAcbs: jest.fn(),
}));
jest.mock('components/surveillance/reporting/report', () => {
  const mockReact = jest.requireActual('react');
  return {
    __esModule: true,
    default: function ChplReport({ acb }) {
      return mockReact.createElement('div', { 'data-testid': 'report' }, acb.name);
    },
    ChplReportLoading: function ChplReportLoading() {
      return mockReact.createElement('div', { 'data-testid': 'report-loading' });
    },
  };
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

  describe('while the ONC-ACBs load', () => {
    beforeEach(() => {
      useFetchAcbs.mockReturnValue({ data: undefined, isLoading: true, isSuccess: false });
    });

    it('shows ONC staff a skeleton of the menu and introduction, without the real ones', () => {
      render(
        <UserContext.Provider value={{ hasAnyRole: (roles) => roles.includes('chpl-onc') }}>
          <ChplSurveillanceReporting />
        </UserContext.Provider>,
      );

      expect(screen.getByRole('status')).toHaveTextContent('Loading ONC-ACBs');
      expect(acbButtonNames()).toEqual([]);
      expect(screen.queryByText('Quarterly and Annual Surveillance Reporting')).not.toBeInTheDocument();
      expect(screen.getByText('Surveillance Reporting')).toBeInTheDocument();
    });

    it('shows anyone else the shape of their own ONC-ACB report', () => {
      render(<ChplSurveillanceReporting />);

      expect(screen.getByTestId('report-loading')).toBeInTheDocument();
      expect(screen.queryByText('Quarterly and Annual Surveillance Reporting')).not.toBeInTheDocument();
    });
  });

  it('shows the introduction, and no skeleton, once there are several ONC-ACBs', () => {
    respondWith([{ id: 1, name: 'ICSA Labs' }, { id: 2, name: 'Drummond Group' }]);
    render(<ChplSurveillanceReporting />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Quarterly and Annual Surveillance Reporting')).toBeInTheDocument();
  });
});

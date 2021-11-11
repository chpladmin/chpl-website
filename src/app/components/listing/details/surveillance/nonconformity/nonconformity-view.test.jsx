import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { within } from '@testing-library/dom';
import { when } from 'jest-when';
import userEvent from '@testing-library/user-event';
import * as angularReactHelper from '../../../../../services/angular-react-helper';
import ChplNonconformityView from './nonconformity-view';

const survWith1Nonconformity = {
  id: 973,
  friendlyId: 'SURV01',
  certifiedProduct: {
    id: 10332,
    chplProductNumber: '15.04.04.2880.Athe.AM.07.1.200312',
    lastModifiedDate: 1616496456285,
    edition: '2015',
    certificationDate: 1583985600000,
    certificationStatus: 'Active',
    curesUpdate: false,
  },
  startDate: 1584331200000,
  endDate: 1596513600000,
  type: {
    id: 1,
    name: 'Reactive',
  },
  randomizedSitesUsed: null,
  requirements: [{
    id: 1522,
    type: {
      id: 1,
      name: 'Certified Capability',
    },
    requirement: '170.315 (c)(1)',
    criterion: {
      id: 25,
      number: '170.315 (c)(1)',
      title: 'Clinical Quality Measures - Record and Export',
      certificationEditionId: 3,
      certificationEdition: '2015',
      description: null,
      removed: false,
    },
    result: {
      id: 1,
      name: 'Non-Conformity',
    },
    nonconformities: [{
      id: 1086,
      nonconformityType: '170.315 (c)(1)',
      criterion: {
        id: 25,
        number: '170.315 (c)(1)',
        title: 'Clinical Quality Measures - Record and Export',
        certificationEditionId: 3,
        certificationEdition: '2015',
        description: null,
        removed: false,
      },
      status: {
        id: 2,
        name: 'Closed',
      },
      dateOfDetermination: 1584244800000,
      capApprovalDate: 1587614400000,
      capStartDate: 1584331200000,
      capEndDate: 1596513600000,
      capMustCompleteDate: 1597377600000,
      summary: 'Limitations in running QRDA I files',
      findings: 'Test Findings',
      sitesPassed: null,
      totalSites: null,
      developerExplanation: null,
      resolution: 'QRDA I files can now be ran on demand.',
      documents: [],
      lastModifiedDate: 1597786978488,
      nonconformityTypeName: '170.315 (c)(1)',
    }],
    requirementName: '170.315 (c)(1)',
  }, {
    id: 1523,
    type: {
      id: 1,
      name: 'Certified Capability',
    },
    requirement: '170.315 (k)(1)',
    requirementName: '170.315 (k)(1)',
    result: {
      id: 1,
      name: 'Non-Conformity',
    },
    nonconformities: [{
      id: 1087,
      nonconformityType: 'Other Requirement',
      status: {
        id: 2,
        name: 'Closed',
      },
      dateOfDetermination: 1584244800000,
      capApprovalDate: 1587614400000,
      capStartDate: 1584331200000,
      capEndDate: 1596513600000,
      capMustCompleteDate: 1597377600000,
      summary: 'Limitations in running QRDA I files',
      findings: 'Test Findings',
      sitesPassed: null,
      totalSites: null,
      developerExplanation: null,
      resolution: 'QRDA I files can now be ran on demand.',
      documents: [],
      lastModifiedDate: 1597786978488,
      nonconformityTypeName: '170.315 (c)(1)',
    }],
  }],
  authority: 'ROLE_ACB',
  lastModifiedDate: 1597786978488,
};

const survWithRandomized = {
  id: 973,
  friendlyId: 'SURV01',
  certifiedProduct: {
    id: 10332,
    chplProductNumber: '15.04.04.2880.Athe.AM.07.1.200312',
    lastModifiedDate: 1616496456285,
    edition: '2015',
    certificationDate: 1583985600000,
    certificationStatus: 'Active',
    curesUpdate: false,
  },
  startDate: 1584331200000,
  endDate: 1596513600000,
  type: {
    id: 1,
    name: 'Randomized',
  },
  randomizedSitesUsed: null,
  requirements: [{
    id: 1522,
    type: {
      id: 1,
      name: 'Certified Capability',
    },
    requirement: '170.315 (c)(1)',
    criterion: {
      id: 25,
      number: '170.315 (c)(1)',
      title: 'Clinical Quality Measures - Record and Export',
      certificationEditionId: 3,
      certificationEdition: '2015',
      description: null,
      removed: false,
    },
    result: {
      id: 1,
      name: 'Non-Conformity',
    },
    nonconformities: [{
      id: 1086,
      nonconformityType: '170.315 (c)(1)',
      criterion: {
        id: 25,
        number: '170.315 (c)(1)',
        title: 'Clinical Quality Measures - Record and Export',
        certificationEditionId: 3,
        certificationEdition: '2015',
        description: null,
        removed: false,
      },
      status: {
        id: 2,
        name: 'Closed',
      },
      dateOfDetermination: 1584244800000,
      capApprovalDate: 1587614400000,
      capStartDate: 1584331200000,
      capEndDate: 1596513600000,
      capMustCompleteDate: 1597377600000,
      summary: 'Limitations in running QRDA I files',
      findings: 'Test Findings',
      sitesPassed: 20,
      totalSites: 25,
      developerExplanation: null,
      resolution: 'QRDA I files can now be ran on demand.',
      documents: [],
      lastModifiedDate: 1597786978488,
      nonconformityTypeName: '170.315 (c)(1)',
    }],
    requirementName: '170.315 (c)(1)',
  }],
  authority: 'ROLE_ACB',
  lastModifiedDate: 1597786978488,
};

const nonconformityTypes = [];

jest.mock('../../../../util/criterion-title', () => () => <div>Criteria Title</div>);

const dateUtilMock = {
  getDisplayDateFormat: jest.fn(() => 'June 1, 2020'),
};

angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('DateUtil').mockReturnValue(dateUtilMock);

describe('the ChplNonconformityView component', () => {
  afterEach(() => {
    cleanup();
  });

  describe('when originally rendering', () => {
    beforeEach(async () => {
      render(
        <ChplNonconformityView
          surveillance={survWith1Nonconformity}
          requirement={survWith1Nonconformity.requirements[0]}
          nonconformity={survWith1Nonconformity.requirements[0].nonconformities[0]}
          nonconformityTypes={nonconformityTypes}
        />,
      );
    });

    it('should not display the table of attributes', async () => {
      const table = screen.getByLabelText('Non-conformity Table');

      await waitFor(() => {
        expect(table).not.toBeVisible();
      });
    });
  });

  describe('when rendering a requirement/non-conformity with a criteria', () => {
    beforeEach(async () => {
      render(
        <ChplNonconformityView
          surveillance={survWith1Nonconformity}
          requirement={survWith1Nonconformity.requirements[0]}
          nonconformity={survWith1Nonconformity.requirements[0].nonconformities[0]}
          nonconformityTypes={nonconformityTypes}
        />,
      );
    });

    describe('when the header is clicked', () => {
      beforeEach(async () => {
        userEvent.click(screen.getByTestId('nonconformity-accordion-header'));
      });

      it('should display the table of attributes', async () => {
        const table = screen.getByLabelText('Non-conformity Table');

        await waitFor(() => {
          expect(table).toBeVisible();
        });
      });
      it('should display the criteria as the non-conformity type', async () => {
        const tableCell = screen.getByTestId('nonconformity-type');

        await waitFor(() => {
          expect(within(tableCell).getByText(/Criteria Title/i)).toBeVisible();
        });
      });
    });
  });

  describe('when rendering a requirement/non-conformity without criteria', () => {
    beforeEach(async () => {
      render(
        <ChplNonconformityView
          surveillance={survWith1Nonconformity}
          requirement={survWith1Nonconformity.requirements[1]}
          nonconformity={survWith1Nonconformity.requirements[1].nonconformities[0]}
          nonconformityTypes={nonconformityTypes}
        />,
      );
    });

    describe('when the header is clicked', () => {
      beforeEach(async () => {
        userEvent.click(screen.getByTestId('nonconformity-accordion-header'));
      });

      it('should display the "Other Requirement" as the non-conformity type', async () => {
        const tableCell = screen.getByTestId('nonconformity-type');

        await waitFor(() => {
          expect(within(tableCell).getByText(/Other Requirement/i)).toBeVisible();
        });
      });
    });
  });

  describe('when rendering a requirement/non-conformity with a criteria', () => {
    beforeEach(async () => {
      render(
        <ChplNonconformityView
          surveillance={survWithRandomized}
          requirement={survWithRandomized.requirements[0]}
          nonconformity={survWithRandomized.requirements[0].nonconformities[0]}
          nonconformityTypes={nonconformityTypes}
        />,
      );
    });

    describe('when the header is clicked', () => {
      beforeEach(async () => {
        userEvent.click(screen.getByTestId('nonconformity-accordion-header'));
      });

      it('should display the "Other Requirement" as the non-conformity type', async () => {
        const tableRow = screen.getByTestId('pass-rate-row');

        await waitFor(() => {
          expect(tableRow).toBeVisible();
        });
      });
    });
  });
});

import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { when } from 'jest-when';
import * as angularReactHelper from '../../../../services/angular-react-helper';
import ChplSurveillanceView from './surveillance-view';
// import ChplNonconformityView from './nonconformity/nonconformity-view';
// import ChplCriterionTitle from '../../../util/criterion-title';

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
  }],
  authority: 'ROLE_ACB',
  lastModifiedDate: 1597786978488,
};

const dateUtilMock = {
  timestampToString: jest.fn(() => 'June 1, 2020'),
};

jest.mock('./nonconformity/nonconformity-view', () => () =><div data-testid="non-conformity-component" />);

angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('DateUtil').mockReturnValue(dateUtilMock);

describe('the ChplSurveillanceView component', () => {
  beforeEach(async () => {
    render(
      <ChplSurveillanceView
        surveillance={survWith1Nonconformity}
      />,
    );
  });
  afterEach(() => {
    cleanup();
  });

  it('should display the table of attributes', async () => {
    const table = screen.getByTestId('surveillance-attributes-table');

    await waitFor(() => {
      expect(table).toBeVisible();
    });
  });
  it('should use the DateUtil.timestampToString to format dates', async () => {
    await waitFor(() => {
      expect(dateUtilMock.timestampToString).toHaveBeenCalled();
    });
  });

  describe('when the surveillance has a closed non-formity', () => {
    /*
    it("should display 'Certified Capability : 170.315 (c)(1) : Clinical Quality Measures - Record and Export' for CertificationCriteria and Program Requirements Surveilled", async () => {
      const tableCell = screen.getByTestId('criteria-reqs-surveilled');
      await waitFor(() => {
        expect(tableCell).toC
        Certified Capability : 170.315 (c)(1) : Clinical Quality Measures - Record and Export
      });
    })
    */
    it('should display the non-conformities header', async () => {
      const header = screen.getByTestId('non-conformity-header');

      await waitFor(() => {
        expect(header).toBeVisible();
      });
    });
    it('should display 1 non-conformity component', async () => {
      await waitFor(() => {
        const components = screen.getAllByTestId('non-conformity-component');
        expect(components.length).toEqual(1);
      });
    });
  });
});

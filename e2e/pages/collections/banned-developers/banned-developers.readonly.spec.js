import Hooks from '../../../utilities/hooks';

import BannedDevelopersPage from './banned-developers.po';

let hooks;
let page;

describe('the Developers Under Certification Ban collection page', () => {
  beforeEach(async () => {
    page = new BannedDevelopersPage();
    hooks = new Hooks();
    hooks.open('#/collections/developers');
    await hooks.waitForSpinnerToDisappear();
  });

  it('should have body text', () => {
    expect(page.bodyText.getText()).toContain('This is a list of health IT developers currently precluded from certifying any health IT products under the ONC Health IT Certification Program - including new products as well as upgraded versions of current products. ONC may lift these statuses if it determines that the developer has taken appropriate steps to remedy problems or issues for all affected products and users and prevent their recurrence. A developer may be precluded from certifying products for two reasons:');
    expect(page.bodyText.getText()).toContain('A developer may be precluded from the Program if the developer or one of its products fails to comply with any requirements of certification and the developer fails to take appropriate actions to correct the non-compliance.');
    expect(page.bodyText.getText()).toContain('A developer may also be precluded if it fails to cooperate with the surveillance or other oversight of its certified products. ONC may lift the ban if it determines that the developer has taken appropriate steps to remedy problems or issues for all affected products and users and prevent their recurrence.');
  });

  it('should have table headers in a defined order', () => {
    const expectedHeaders = ['Developer\nsorted ascending', 'Decertification Date', 'ONC-ACB'];
    const actualHeaders = page.getTableHeaders();
    expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
    actualHeaders.forEach((header, idx) => {
      expect(header.getText()).toBe(expectedHeaders[idx]);
    });
  });

  describe('when filtering', () => {
    describe('using predefined filters', () => {
      let countBefore;
      let countAfter;
      beforeEach(() => {
        countBefore = page.getListingTotalCount();
      });

      afterEach(() => {
        page.resetFilters();
      });

      describe('when removing "Drummond"', () => {
        it('should filter listing results', () => {
          page.removeFilter('ONC-ACB', 'Drummond Group');
          expect(page.hasNoResults()).toBe(true);
        });
      });

      xdescribe('using date filter', () => {
        it('should filter listing results', () => {
          page.dateFilter.click();
          page.fromDate.setValue('09/01/2017')
          page.toDate.setValue('10/01/2019');
          page.waitForUpdatedListingResultsCount();
          countAfter = page.getListingTotalCount();
          expect(countAfter).toBeLessThan(countBefore);
        });
      });
    });

    describe('by text', () => {
      afterEach(() => {
        page.clearSearchTerm();
      });

      it('should search by developer name', () => {
        const searchTerm = 'Rabbit';
        page.searchForText(searchTerm);
        expect(page.hasNoResults()).toBe(true);
      });

      it('should search by developer code', () => {
        const searchTerm = '2943';
        const developerName = 'SocialCare by Health Symmetric, Inc.';
        const columnIndex = 0;
        page.searchForText(searchTerm);
        expect(page.getTableCellText(page.results[0], columnIndex)).toContain(developerName);
      });
    });
  });
});

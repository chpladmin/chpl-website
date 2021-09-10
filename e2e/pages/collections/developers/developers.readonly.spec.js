import DevelopersPage from './developers.po';
import Hooks from '../../../utilities/hooks';

let hooks; let page;

describe('the Developers Under Certification Ban collection page', () => {
  beforeEach(async () => {
    page = new DevelopersPage();
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
    const expectedHeaders = ['Developer', 'Developer', 'Date', 'ONC-ACB'];
    const actualHeaders = page.getListingTableHeaders();
    expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
    actualHeaders.forEach((header, idx) => {
      expect(header.getText()).toBe(expectedHeaders[idx]);
    });
  });

  describe('when filtering', () => {
    let countBefore;
    let countAfter;
    beforeEach(() => {
      countBefore = page.listingTotalCount();
    });

    afterEach(() => {
      page.clearFilters.scrollAndClick();
    });

    describe('using acb filter to de select drummond group', () => {

      it('should filter listing results', () => {
        page.selectFilter('acb', 'Drummond_Group');
        page.waitForUpdatedListingResultsCount();
        countAfter = page.listingTotalCount();
        expect(countAfter).toBeLessThan(countBefore);
      });
    });

    describe('using date filter', () => {

      it('should filter listing results', () => {
        page.dateFilter.scrollAndClick();
        page.fromDate.addValue('09/01/2017');
        page.toDate.addValue('10/01/2019');
        page.waitForUpdatedListingResultsCount();
        countAfter = page.listingTotalCount();
        expect(countAfter).toBeLessThan(countBefore);
      });
    });
  });
  
  describe('when searching listing by developer', () => {
    const DEVELOPER_COL_IDX = 1;
    const developerName = 'Rabbit';
    it('should only show listings that match the developer', () => {
      page.searchForListing(developerName);
      page.waitForUpdatedListingResultsCount();
      const count = page.listingTotalCount();
      for (let i = 1; i <= count; i++) {
        expect(page.getColumnText(i, DEVELOPER_COL_IDX)).toContain(developerName);
      }
    });
  });
});

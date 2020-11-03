import SearchPage from './search.po.js';
import Hooks from '../../utilities/hooks';

let hooks, page;
const path = require('path');
const fs = require('fs');
const config = require('../../config/mainConfig');
const developerName = 'Allscripts';
const productName = 'TouchWork';
const acbId = '170008R01';
const chplId = '15.99.04.3078.Ninj.01.00.0.200629';
const version = '19';
const totalListing = 500;
const PRODUCT_COL_IDX = 3;
const DEVELOPER_COL_IDX = 2;
const CHPLID_COL_IDX = 6;
const STATUS_COL_IDX = 7;
const EDITION_COL_IDX = 1;

describe('On search page - ', () => {
    var countBefore;
    var countAfter;
    beforeEach(async () => {
        page = new SearchPage();
        hooks = new Hooks();
        await hooks.open('#/search');
    });

    describe('When browsing all listings', () => {
        beforeEach(() => {
            page.browseAllButton.click();
            page.waitForUpdatedListingResultsCount();
        });

        it('should show all listing (more than 500)', () => {
            var count = page.listingTotalCount();
            assert.isAbove(count,totalListing);
        });
    });

    describe('When observing listing details button', () => {
        beforeEach(() => {
            page.waitForUpdatedListingResultsCount();
        });

        it('button should go to details page for the listing', () => {
            assert.include($$('.btn-primary.btn-sm')[1].getAttribute('href'),'/listing/');
        });
    });

    describe('When searching listings by developer', () => {
        beforeEach(() => {
            page.searchForListing(developerName);
            page.waitForUpdatedListingResultsCount();
        });

        afterEach(() => {
            page.clearFilters.click();
        });

        it('should show filtered listing results', () => {
            var count = page.listingTableFirstPageRowCount();
            for (var i = 1; i <= count; i++) {
                assert.include(page.getColumnText(i,DEVELOPER_COL_IDX),developerName);
            }
        });
    });

    describe('When searching listings by product', () => {
        beforeEach(() => {
            page.searchForListing(productName);
            page.waitForUpdatedListingResultsCount();
        });

        afterEach(() => {
            page.clearFilters.click();
        });

        it('should show filtered listing results', () => {
            var count = page.listingTableFirstPageRowCount();
            for (var i = 1; i <= count; i++) {
                assert.include(page.getColumnText(i,PRODUCT_COL_IDX),productName);
            }
        });
    });

    describe('When searching listings by ONC-ACB ID', () => {
        beforeEach(() => {
            page.searchForListing(acbId);
            page.waitForUpdatedListingResultsCount();
        });

        afterEach(() => {
            page.clearFilters.click();
        });

        it('should show filtered listing results', () => {
            var count = page.listingTableFirstPageRowCount();
            assert.equal(count,1);
        });

    });

    describe('When searching listings by CHPL ID', () => {
        beforeEach(() => {
            page.searchForListing(chplId);
            page.waitForUpdatedListingResultsCount();
        });

        afterEach(() => {
            page.clearFilters.click();
        });

        it('should show filtered listing results', () => {
            var count = page.listingTableFirstPageRowCount();
            for (var i = 1; i <= count; i++) {
                assert.include(page.getColumnText(i,CHPLID_COL_IDX),chplId);
            }
        });
    });

    describe('When using certification status filter as "Retired" ', () => {
        beforeEach(() => {
            countBefore = page.listingTotalCount();
            page.expandFilterOptions('status').click();
            page.statusRetiredFilterOption.click();
            page.waitForUpdatedListingResultsCount();
        });

        afterEach(() => {
            page.clearFilters.click();
        });

        it('should filter listing results', () => {
            countAfter = page.listingTotalCount();
            assert.isAbove(countAfter,countBefore);
        });

        it('should at least show 1 retired listing', () => {
            let isInclude = false;
            for (var i = 1; i <= page.listingTableFirstPageRowCount(); i++) {
                if (page.getColumnText(i,STATUS_COL_IDX).includes('Retired')) {
                    isInclude = true;
                    break;
                }
            }
            assert.equal(true, isInclude);
        });
    });

    describe('When using certification edition filter as 2014', () => {
        beforeEach(() => {
            countBefore = page.listingTotalCount();
            page.expandFilterOptions('edition').click();
            page.edition2014FilterOption.click();
            page.waitForUpdatedListingResultsCount();
        });

        afterEach(() => {
            page.clearFilters.click();
        });

        it('should filter listing results', () => {
            countAfter = page.listingTotalCount();
            assert.isAbove(countAfter,countBefore);
        });

        it('should at least show 1 2014 listing', () => {
            let isInclude = false;
            for (var i = 1; i <= page.listingTableFirstPageRowCount(); i++) {
                if (page.getColumnText(i,EDITION_COL_IDX).includes('2014')) {
                    isInclude = true;
                    break;
                }
            }
            assert.equal(true, isInclude);
        });
    });

    describe('When using certification criteria filter as 170.315 (A)(1)', () => {
        beforeEach(() => {
            page.waitForUpdatedListingResultsCount();
            countBefore = page.listingTotalCount();
            page.expandFilterOptions('criteria').click();
            page.criteria2015FilterExpand.click();
            page.criteria2015FilterOption.click();
            page.waitForUpdatedListingResultsCount();
        });

        afterEach(() => {
            page.clearFilters.click();
        });

        it('should filter listing results', () => {
            countAfter = page.listingTotalCount();
            assert.isBelow(countAfter,countBefore);
        });
    });

    describe('When using surveillance activity filter as has never had surveillance', () => {
        beforeEach(() => {
            page.waitForUpdatedListingResultsCount();
            countBefore = page.listingTotalCount();
            page.expandFilterOptions('surveillance').click();
            page.surveillanceNeverHadFilter.click();
            page.waitForUpdatedListingResultsCount();
        });

        afterEach(() => {
            page.clearFilters.click();
        });

        it('should filter listing results', () => {
            countAfter = page.listingTotalCount();
            assert.isBelow(countAfter,countBefore);
        });
    });

    describe('When using More filter on 2014/2015 CQM', () => {
        beforeEach(() => {
            countBefore = page.listingTotalCount();
            page.moreFilterButton.click();
            page.moreFilterExpand(' View Clinical Quality Measures ').click();
            page.moreFilterExpand(' View 2014/2015 Clinical Quality Measures ').click();
            page.moreCqmFilterOptions('CMS2').click();
            page.waitForUpdatedListingResultsCount();
        });

        afterEach(() => {
            page.clearFilters.click();
        });

        it('should filter listing results', () => {
            countAfter = page.listingTotalCount();
            assert.isBelow(countAfter,countBefore);
        });
    });

    describe('When using More filter on ONC/ACBs', () => {
        beforeEach(() => {
            page.waitForUpdatedListingResultsCount();
            countBefore = page.listingTotalCount();
            page.moreFilterButton.click();
            page.moreFilterExpand(' View ONC-ACBs ').scrollAndClick();
            page.moreOncAcbFilterOptions('Drummond_Group').scrollAndClick();
            page.waitForUpdatedListingResultsCount();
        });

        afterEach(() => {
            page.clearFilters.click();
        });

        it('should filter listing results', () => {
            countAfter = page.listingTotalCount();
            assert.isBelow(countAfter,countBefore);
        });
    });

    describe('When using More filter on Practice Type', () => {
        beforeEach(() => {
            countBefore = page.listingTotalCount();
            page.moreFilterButton.click();
            page.moreFilterExpand(' View Practice Type ').scrollAndClick();
            page.morePracticeTypeDropdownOptions.selectByVisibleText('Inpatient');
            page.waitForUpdatedListingResultsCount();
        });

        afterEach(() => {
            page.clearFilters.click();
        });

        it('should filter listing results', () => {
            if (!page.pagination.isExisting()) {
                countAfter = 0;
            } else {
                countAfter = page.listingTotalCount();
            }
            assert.isBelow(countAfter,countBefore);
        });
    });

    describe('When using More filter on Certification Date', () => {
        beforeEach(() => {
            page.waitForUpdatedListingResultsCount();
            countBefore = page.listingTotalCount();
            page.moreFilterButton.click();
            page.moreFilterExpand(' View Certification Date ').click();
            page.moreCertificationEndDateFilter.addValue('01/01/2019');
            page.waitForUpdatedListingResultsCount();
        });

        afterEach(() => {
            page.clearFilters.click();
        });

        it('should filter listing results', () => {
            countAfter = page.listingTotalCount();
            assert.isBelow(countAfter,countBefore);
        });
    });

    describe('When using More filter on Developer/ Product/ Version', () => {
        beforeEach(() => {
            countBefore = page.listingTotalCount();
            page.moreFilterButton.click();
            page.moreDeveloperFilter.addValue(developerName);
            page.moreProductFilter.addValue(productName);
            page.moreVersionFilter.addValue(version);
            page.waitForUpdatedListingResultsCount();
        });

        afterEach(() => {
            page.clearFilters.click();
        });

        it('should filter listing results', () => {
            countAfter = page.listingTableFirstPageRowCount();
            assert.isBelow(countAfter,countBefore);
        });
        it('should filter listing results', () => {
            for (var i = 1; i <= page.listingTableFirstPageRowCount(); i++) {
                assert.include(page.getColumnText(i,2),developerName);
                assert.include(page.getColumnText(i,3),productName);
                assert.include(page.getColumnText(i,4),version);
            }
        });
    });
    describe('After searching for a listing', () => {
        beforeEach(() => {
            page.searchForListing(developerName);
            page.waitForUpdatedListingResultsCount();
        });

        it('Clear filters button should clear all filtered results and show all listings', () => {
            page.clearFilters.click();
            page.waitForUpdatedListingResultsCount();
            assert.isAbove(page.listingTotalCount(),900);
        });

        it('Browse all button should show all listings', () => {
            page.browseAll.click();
            page.waitForUpdatedListingResultsCount();
            assert.isAbove(page.listingTotalCount(),900);
        });
    });

    describe('When using Download Results', () => {
        beforeEach(() => {
            page.downloadResultsButton.click();
            page.downloadResultsCustomizeButton.scrollAndClick();
        });

        it('should download file', () => {
            const fileName = 'search-results.csv';
            const filePath = path.join(global.downloadDir, fileName);
            browser.waitForFileExists(filePath,config.timeout);
            assert.isTrue(fs.existsSync(filePath));
        });
    });
});

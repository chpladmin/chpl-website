import SearchPage from './search.po.js';
import Hooks from '../../utilities/hooks';

let hooks, page;
const developerName= 'AllScripts';
const productName= 'TouchWork';
const acbId= '170008R01';
const chplId= '15.99.04.3078.Ninj.01.00.0.200629';

beforeEach(async () => {
    page = new SearchPage();
    hooks = new Hooks();
    await hooks.open('#/search');
});

describe('On search page- When searching listings by developer', () => {
    beforeAll(() => {
        page.searchForListing(developerName);
        browser.pause(5000);
    });

    it('should show appropriate listing results', () => {
        var count=page.listingTableRowCount();
        for (var i=1; i<=count;i++){
            assert.include(page.getColumnText(i,2),developerName);
        }
    });
});
describe('On search page- When searching listings by product', () => {
    beforeAll(() => {
        page.searchForListing(productName);
        browser.pause(5000);
    });

    it('should show appropriate listing results', () => {
        var count= page.listingTableRowCount();
        for (var i=1; i<=count;i++){
            assert.include(page.getColumnText(i,3),productName);
        }
    });

});

describe('On search page- When searching listings by ONC-ACB Id', () => {
    beforeAll(() => {
        page.searchForListing(acbId);
        browser.pause(5000);
    });

    it('should show appropriate listing results', () => {
        var count= page.listingTableRowCount();
        assert.equal(count,1);
    });

});

describe('On search page- When searching listings by ONC-ACB Id', () => {
    beforeAll(() => {
        page.searchForListing(chplId);
        browser.pause(5000);
    });

    it('should show appropriate listing results', () => {
        var count= page.listingTableRowCount();
        for (var i=1; i<=count;i++){
            assert.include(page.getColumnText(i,6),chplId);
        }
    });

});

describe('On search page- When browsing all listings', () => {
    beforeAll(() => {
        page.browseAllButton.click();
    });

    it('should show all listing', () => {
        var count= page.listingTableRowCount();
        assert.isAbove(count,900);
    });

});
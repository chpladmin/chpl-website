import SearchPage from './search.po.js';
import Hooks from '../../utilities/hooks';

let hooks, page;
const apiInfoLink = '#/collections/api-documentation';
const sedInfoLink = '#/collections/sed';
const correctiveActionLink = '#/collections/corrective-action';
const decertifiedProductsLink = '#/collections/products';
const inactiveCertificatesLink = '#/collections/inactive';
const bannedDevelopersLink = '#/collections/developers';
const chartsLink = '#/charts';

beforeAll(async () => {
    page = new SearchPage();
    hooks = new Hooks();
    await hooks.open('#/search');
});

describe('Search home page', () => {

    it('should have search for a listing text bar', () => {
        assert.isTrue(page.searchListing.isDisplayed());
    });

    it('should have "Browse all" button', () => {
        assert.isTrue(page.browseAllButton.isDisplayed());
    });

});

describe('On search home page- "API Info for 2015 Ed. Products" button', () => {

    it('should be displayed', () => {
        assert.isTrue(page.homeSearchPageButtons('API Info for 2015 Ed. Products').isDisplayed());
    });
    it('should be clickable', () => {
        assert.isTrue(page.homeSearchPageButtons('API Info for 2015 Ed. Products').isClickable());
    });
    it('should have correct link to API documentation page', () => {
        assert.equal(page.homeSearchPageButtons('API Info for 2015 Ed. Products').getAttribute('href'),browser.options.baseUrl + apiInfoLink);
    });
});

describe('On search home page- "SED Info for 2015 Ed. Products" button', () => {

    it('should be displayed', () => {
        assert.isTrue(page.homeSearchPageButtons('SED Info for 2015 Ed. Products').isDisplayed());
    });
    it('should be clickable', () => {
        assert.isTrue(page.homeSearchPageButtons('SED Info for 2015 Ed. Products').isClickable());
    });
    it('should have correct link to SED information page', () => {
        assert.equal(page.homeSearchPageButtons('SED Info for 2015 Ed. Products').getAttribute('href'),browser.options.baseUrl + sedInfoLink);
    });
});

describe('On search home page- "Products: Corrective Action" button', () => {

    it('should be displayed', () => {
        assert.isTrue(page.homeSearchPageButtons('Products: Corrective Action').isDisplayed());
    });
    it('should be clickable', () => {
        assert.isTrue(page.homeSearchPageButtons('Products: Corrective Action').isClickable());
    });
    it('should have correct link to Corrective action page', () => {
        assert.equal(page.homeSearchPageButtons('Products: Corrective Action').getAttribute('href'),browser.options.baseUrl + correctiveActionLink);
    });
});
describe('On search home page- "Decertified Products" button', () => {

    it('should be displayed', () => {
        assert.isTrue(page.homeSearchPageButtons('Decertified Products').isDisplayed());
    });
    it('should be clickable', () => {
        assert.isTrue(page.homeSearchPageButtons('Decertified Products').isClickable());
    });
    it('should have correct link to Decertified Products page', () => {
        assert.equal(page.homeSearchPageButtons('Decertified Products').getAttribute('href'),browser.options.baseUrl + decertifiedProductsLink);
    });
});
describe('On search home page- "Inactive Certificates" button', () => {

    it('should be displayed', () => {
        assert.isTrue(page.homeSearchPageButtons('Inactive Certificates').isDisplayed());
    });
    it('should be clickable', () => {
        assert.isTrue(page.homeSearchPageButtons('Inactive Certificates').isClickable());
    });
    it('should have correct link to Inactive Certificates page', () => {
        assert.equal(page.homeSearchPageButtons('Inactive Certificates').getAttribute('href'),browser.options.baseUrl + inactiveCertificatesLink);
    });
});
describe('On search home page- "Banned Developers" button', () => {

    it('should be displayed', () => {
        assert.isTrue(page.homeSearchPageButtons('Banned Developers').isDisplayed());
    });
    it('should be clickable', () => {
        assert.isTrue(page.homeSearchPageButtons('Banned Developers').isClickable());
    });
    it('should have correct link to Banned Developers page', () => {
        assert.equal(page.homeSearchPageButtons('Banned Developers').getAttribute('href'),browser.options.baseUrl + bannedDevelopersLink);
    });
});
describe('On search home page- "Charts" button', () => {

    it('should be displayed', () => {
        assert.isTrue(page.homeSearchPageButtons('Charts').isDisplayed());
    });
    it('should be clickable', () => {
        assert.isTrue(page.homeSearchPageButtons('Charts').isClickable());
    });
    it('should have correct link to Charts page', () => {
        assert.equal(page.homeSearchPageButtons('Charts').getAttribute('href'),browser.options.baseUrl + chartsLink);
    });
});

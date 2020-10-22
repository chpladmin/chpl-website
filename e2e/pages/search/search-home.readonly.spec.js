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

describe('Search page', () => {

    it('should have search listing bar', () => {
        assert.isTrue(page.searchListing.isDisplayed());
    });

    it('should have "Browse all" button', () => {
        assert.isTrue(page.browseAllButton.isDisplayed());
    });

});

describe('On Search page- "API Info for 2015 Ed. Products" button', () => {

    it('should be displayed', () => {
        assert.isTrue(page.apiInfoButton.isDisplayed());
    });
    it('should be clickable', () => {
        assert.isTrue(page.apiInfoButton.isDisplayed());
    });
    it('should have correct link to API documentation page', () => {
        assert.equal(page.apiInfoButton.getAttribute('href'),browser.options.baseUrl + apiInfoLink);
    });
});

describe('On Search page- "SED Info for 2015 Ed. Products" button', () => {

    it('should be displayed', () => {
        assert.equal(page.sedInfoButton.isDisplayed(),true);
    });
    it('should be clickable', () => {
        assert.equal(page.sedInfoButton.isDisplayed(),true);
    });
    it('should have correct link to SED information page', () => {
        assert.equal(page.sedInfoButton.getAttribute('href'),browser.options.baseUrl + sedInfoLink);
    });
});
describe('On Search page- "Products: Corrective Action" button', () => {

    it('should be displayed', () => {
        assert.equal(page.correctiveActionButton.isDisplayed(),true);
    });
    it('should be clickable', () => {
        assert.equal(page.correctiveActionButton.isDisplayed(),true);
    });
    it('should have correct link to Corrective action page', () => {
        assert.equal(page.correctiveActionButton.getAttribute('href'),browser.options.baseUrl + correctiveActionLink);
    });
});
describe('On Search page- "Decertified Products" button', () => {

    it('should be displayed', () => {
        assert.equal(page.decertifiedProductsButton.isDisplayed(),true);
    });
    it('should be clickable', () => {
        assert.equal(page.decertifiedProductsButton.isDisplayed(),true);
    });
    it('should have correct link to Decertified Products page', () => {
        assert.equal(page.decertifiedProductsButton.getAttribute('href'),browser.options.baseUrl + decertifiedProductsLink);
    });
});
describe('On Search page- "Inactive Certificates" button', () => {

    it('should be displayed', () => {
        assert.equal(page.inactiveCertificatesButton.isDisplayed(),true);
    });
    it('should be clickable', () => {
        assert.equal(page.inactiveCertificatesButton.isDisplayed(),true);
    });
    it('should have correct link to Inactive Certificates page', () => {
        assert.equal(page.inactiveCertificatesButton.getAttribute('href'),browser.options.baseUrl + inactiveCertificatesLink);
    });
});
describe('On Search page- "Banned Developers" button', () => {

    it('should be displayed', () => {
        assert.equal(page.bannedDevelopersButton.isDisplayed(),true);
    });
    it('should be clickable', () => {
        assert.equal(page.bannedDevelopersButton.isDisplayed(),true);
    });
    it('should have correct link to Banned Developers page', () => {
        assert.equal(page.bannedDevelopersButton.getAttribute('href'),browser.options.baseUrl + bannedDevelopersLink);
    });
});
describe('On Search page- "Charts" button', () => {

    it('should be displayed', () => {
        assert.equal(page.chartsButton.isDisplayed(),true);
    });
    it('should be clickable', () => {
        assert.equal(page.chartsButton.isDisplayed(),true);
    });
    it('should have correct link to Charts page', () => {
        assert.equal(page.chartsButton.getAttribute('href'),browser.options.baseUrl + chartsLink);
    });
});

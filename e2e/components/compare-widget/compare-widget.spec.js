import CompareWidgetComponent from './compare-widget.po';
import SearchPage from '../../pages/search/search.po';
import Hooks from '../../utilities/hooks';

let compare, hooks, search;
let listingId1 = 9261;
let listingId2 = 9956;
let search1 = '(SQI) Solution For Quality Improvement';
let search2 = '24/7 smartEMR';

beforeEach(async () => {
    search = new SearchPage();
    compare = new CompareWidgetComponent();
    hooks = new Hooks();
    browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
    browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
    await hooks.open('#/search');
});

describe('on compare widget', () => {
    describe('if there is no listing added for compare', () => {

        it('should not have compare products button', () => {
            compare.compareWidget.click();
            assert.isFalse(compare.compareProductsButton.isDisplayed());
        });

        it('should not have remove all products button', () => {
            compare.compareWidget.click();
            assert.isFalse(compare.removeProductsButton.isDisplayed());
        });
    });

    describe('if there is exactly 1 listing added for compare', () => {
        beforeAll(() => {
            search.searchForListing(search2);
            compare.addListingToCompare(listingId2);
        });

        it('should have compare products button but disabled', () => {
            assert.isTrue(compare.compareProductsButton.isDisplayed());
            assert.isFalse(compare.compareProductsButton.isClickable());
        });

        it('should have remove all products button and enabled', () => {
            assert.isTrue(compare.removeProductsButton.isDisplayed());
            assert.isTrue(compare.removeProductsButton.isClickable());
        });

        it('remove products removes products', () => {
            compare.removeProductsButton.click();
            assert.isFalse(compare.removeProductsButton.isDisplayed());
            assert.isFalse(compare.compareProductsButton.isDisplayed());
        });
    });

    describe('if there are at least 2 listings added for compare', () => {
        beforeAll(() => {
            search.searchForListing(search1);
            compare.addListingToCompare(listingId1);
            search.searchForListing(search2);
            compare.addListingToCompare(listingId2);
        });

        it('should have compare products button and enabled', () => {
            assert.isTrue(compare.compareProductsButton.isDisplayed());
            assert.isTrue(compare.compareProductsButton.isClickable());
        });

        it('should have remove all products button and enabled', () => {
            assert.isTrue(compare.removeProductsButton.isDisplayed());
            assert.isTrue(compare.removeProductsButton.isClickable());
        });

        it('compare products button opens compare page for the selected listings', () => {
            compare.compareProductsButton.click();
            assert.include(browser.getUrl(),'/compare/' + listingId1 + '&' + listingId2);
        });
    });
});

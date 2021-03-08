import CompareWidgetComponent from './compare-widget.po';
import SearchPage from '../../pages/search/search.po';
import Hooks from '../../utilities/hooks';

let compare, hooks, search;
let ListingId1 = 9347;
let ListingId2 = 9861;
let search1 = '2216';//using developer code to search listing
let search2 = '1757';//using developer code to search listing

beforeAll(async () => {
  search = new SearchPage();
  compare = new CompareWidgetComponent();
  hooks = new Hooks();
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
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => search.getColumnText(1,6).includes(search2));
      compare.addListingToCompare(ListingId2);
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
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => search.getColumnText(1,6).includes(search1));
      compare.addListingToCompare(ListingId1);
      search.searchForListing(search2);
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => search.getColumnText(1,6).includes(search2));
      compare.addListingToCompare(ListingId2);
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
      assert.include(browser.getUrl(),'/compare/' + ListingId1 + '&' + ListingId2);
    });
  });
});

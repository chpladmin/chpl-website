import CompareWidgetComponent from './compare-widget.po';
import SearchPage from '../../pages/search/search.po';
import Hooks from '../../utilities/hooks';

let compare; let hooks; let
  search;
const ListingId1 = 9347;
const ListingId2 = 9861;
const search1 = '2216';// using developer code to search listing
const search2 = '1757';// using developer code to search listing

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
      expect(compare.compareProductsButton.isDisplayed()).toBe(false);
    });

    it('should not have remove all products button', () => {
      compare.compareWidget.click();
      expect(compare.removeProductsButton.isDisplayed()).toBe(false);
    });
  });

  describe('if there is exactly 1 listing added for compare', () => {
    beforeAll(() => {
      search.searchForListing(search2);
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => search.getColumnText(1, 6).includes(search2));
      compare.addListingToCompare(ListingId2);
    });

    it('should have compare products button but disabled', () => {
      expect(compare.compareProductsButton.isDisplayed()).toBe(true);
      expect(compare.compareProductsButton.isClickable()).toBe(false);
    });

    it('should have remove all products button and enabled', () => {
      expect(compare.removeProductsButton.isDisplayed()).toBe(true);
      expect(compare.removeProductsButton.isClickable()).toBe(true);
    });

    it('remove products removes products', () => {
      compare.removeProductsButton.click();
      expect(compare.removeProductsButton.isDisplayed()).toBe(false);
      expect(compare.compareProductsButton.isDisplayed()).toBe(false);
    });
  });

  describe('if there are at least 2 listings added for compare', () => {
    beforeAll(() => {
      search.searchForListing(search1);
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => search.getColumnText(1, 6).includes(search1));
      compare.addListingToCompare(ListingId1);
      search.searchForListing(search2);
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => search.getColumnText(1, 6).includes(search2));
      compare.addListingToCompare(ListingId2);
    });

    it('should have compare products button and enabled', () => {
      expect(compare.compareProductsButton.isDisplayed()).toBe(true);
      expect(compare.compareProductsButton.isClickable()).toBe(true);
    });

    it('should have remove all products button and enabled', () => {
      expect(compare.removeProductsButton.isDisplayed()).toBe(true);
      expect(compare.removeProductsButton.isClickable()).toBe(true);
    });

    it('compare products button opens compare page for the selected listings', () => {
      compare.compareProductsButton.click();
      expect(browser.getUrl()).toContain(`/compare/${ListingId1}&${ListingId2}`);
    });
  });
});

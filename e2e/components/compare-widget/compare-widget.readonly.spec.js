import SearchPage from '../../pages/collections/search/search.po';
import { open as openPage } from '../../utilities/hooks.async';

import CompareWidgetComponent from './compare-widget.po';

const ListingId1 = 10785;
const ListingId2 = 9861;
const search1 = '1044';// using developer code to search listing
const search2 = '1757';// using developer code to search listing

let compare;
let search;

beforeAll(async () => {
  search = new SearchPage();
  compare = new CompareWidgetComponent();
  await openPage('#/search');
});

describe('on compare widget', () => {
  describe('if there is no listing added for compare', () => {
    it('should not have compare products button', async () => {
      await compare.compareWidget.click();
      await expect(await (await compare.compareProductsButton).isDisplayed()).toBe(false);
    });

    it('should not have remove all products button', async () => {
      await compare.compareWidget.click();
      await expect(await (await compare.removeProductsButton).isDisplayed()).toBe(false);
    });
  });

  describe('if there is exactly 1 listing added for compare', () => {
    beforeAll(async () => {
      search.open();
      search.searchForText(search2);
      compare.addListingToCompare(ListingId2);
    });

    it('should have compare products button but disabled', async () => {
      await expect(await (await compare.compareProductsButton).isDisplayed()).toBe(true);
      await expect(await (await compare.compareProductsButton).isClickable()).toBe(false);
    });

    it('should have remove all products button and enabled', async () => {
      await expect(await (await compare.removeProductsButton).isDisplayed()).toBe(true);
      await expect(await (await compare.removeProductsButton).isClickable()).toBe(true);
    });

    it('remove products removes products', async () => {
      await compare.removeProductsButton.click();
      await expect(await (await compare.removeProductsButton).isDisplayed()).toBe(false);
      await expect(await (await compare.compareProductsButton).isDisplayed()).toBe(false);
    });
  });

  //ignored tests as they are flaky and will address them later
  xdescribe('if there are at least 2 listings added for compare', () => {
    beforeAll(async () => {
      search.open();
      search.searchForText(search1);
      compare.addListingToCompare(ListingId1);
      search.searchForText(search2);
      compare.addListingToCompare(ListingId2);
    });

    it('should have compare products button and enabled', async () => {
      await expect(await (await compare.compareProductsButton).isDisplayed()).toBe(true);
      await expect(await (await compare.compareProductsButton).isClickable()).toBe(true);
    });

    it('should have remove all products button and enabled', async () => {
      await expect(await (await compare.removeProductsButton).isDisplayed()).toBe(true);
      await expect(await (await compare.removeProductsButton).isClickable()).toBe(true);
    });

    it('compare products button opens compare page for the selected listings', async () => {
      await compare.compareProductsButton.click();
      await expect(await browser.getUrl()).toContain(`/compare/${ListingId1}&${ListingId2}`);
    });
  });
});

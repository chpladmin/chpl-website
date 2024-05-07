import { open } from '../../utilities/hooks';
import CmsWidgetComponent from '../../components/cms-widget/cms-widget.po';
import CompareWidgetComponent from '../../components/compare-widget/compare-widget.po';

import ListingPage from './listing.po';

let cmsComponent;
let compareComponent;
let page;

beforeEach(async () => {
  page = new ListingPage();
  cmsComponent = new CmsWidgetComponent();
  compareComponent = new CompareWidgetComponent();
});

describe('when on 2015 listing page', () => {
  beforeEach(async () => {
    await open('#/listing/9833');
    await browser.waitUntil(async () => (await page.productHistory).isDisplayed());
  });

  describe('when clicking on product history button', () => {
    beforeEach(async () => {
      await page.productHistory.click();
    });

    describe('when clicking on Go to API button from product history', () => {
      beforeEach(async () => {
        await page.goToApi.click();
      });

      it('should go to api page', async () => {
        await expect(await browser.getUrl()).toContain('resources/api');
      });
    });
  });

  describe('when clicking on cms id button', () => {
    beforeEach(async () => {
      await (await cmsComponent.certIdButton('9833')).click();
      await cmsComponent.waitForProcessingSpinnerToDisappear();
    });

    it('should add listing to cms widget', async () => {
      await expect(await cmsComponent.progressBar.isDisplayed()).toBe(true);
    });
  });

  it('should have developer page link under developer name', async () => {
    await expect(await (await page.goToDeveloperPageLink('Practice Fusion')).getAttribute('href')).toContain('organizations/developers/');
  });
});

describe('when on 2014 listing page - ', () => {
  beforeEach(async () => {
    await open('#/listing/8490');
    await browser.waitUntil(async () => (await page.productHistory).isDisplayed());
  });

  describe('when clicking on product history button', () => {
    beforeEach(async () => {
      await page.productHistory.click();
    });

    describe('when clicking on Go to API button from product history', () => {
      beforeEach(async () => {
        await page.goToApi.click();
      });

      it('should go to api page', async () => {
        await expect(await browser.getUrl()).toContain('resources/api');
      });
    });
  });

  it('should not have cms widget button', async () => {
    await expect(await (await cmsComponent.certIdButton('8490')).isDisplayed()).toBe(false);
  });

  it('should open developer dashboard', async () => {
    await expect(await (await page.goToDeveloperPageLink('VIPA Health Solutions, LLC')).getAttribute('href')).toContain('organizations/developers/');
  });
});

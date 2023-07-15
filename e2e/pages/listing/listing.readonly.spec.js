import Hooks from '../../utilities/hooks';
import CmsWidgetComponent from '../../components/cms-widget/cms-widget.po';
import CompareWidgetComponent from '../../components/compare-widget/compare-widget.po';

import ListingPage from './listing.po';

let cmsComponent;
let compareComponent;
let hooks;
let page;

beforeEach(() => {
  page = new ListingPage();
  hooks = new Hooks();
  cmsComponent = new CmsWidgetComponent();
  compareComponent = new CompareWidgetComponent();
});

describe('when on 2015 listing page', () => {
  beforeEach(() => {
    hooks.open('#/listing/9833');
    hooks.waitForSpinnerToDisappear();
  });

  describe('when clicking on product history button', () => {
    beforeEach(() => {
      page.productHistory.click();
    });

    describe('when clicking on Go to API button from product history', () => {
      beforeEach(() => {
        page.goToApi.click();
        hooks.waitForSpinnerToDisappear();
      });

      it('should go to api page', () => {
        expect(browser.getUrl()).toContain('resources/api');
      });
    });
  });

  describe('when clicking on cms id button', () => {
    beforeEach(async () => {
      cmsComponent.certIdButton('9833').click();
      hooks.waitForSpinnerToDisappear();
      cmsComponent.waitForProcessingSpinnerToDisappear();
    });

    it('should add listing to cms widget', () => {
      expect(cmsComponent.progressBar.isDisplayed()).toBe(true);
    });
  });

  it('should add listing to compare widget', () => {
    compareComponent.addListingToCompare('9833');
    expect(compareComponent.isInList('Practice Fusion EHR')).toBeTrue();
  });

  it('should have developer page link under developer name', () => {
    expect(page.goToDeveloperPageLink('Practice Fusion').getAttribute('href')).toContain('organizations/developers/');
  });
});

describe('when on 2014 listing page - ', () => {
  beforeEach(() => {
    hooks.open('#/listing/8490');
    hooks.waitForSpinnerToAppear();
    hooks.waitForSpinnerToDisappear();
  });

  describe('when clicking on product history button', () => {
    beforeEach(() => {
      page.productHistory.click();
    });

    describe('when clicking on Go to API button from product history', () => {
      beforeEach(() => {
        page.goToApi.click();
        hooks.waitForSpinnerToDisappear();
      });

      it('should go to api page', () => {
        expect(browser.getUrl()).toContain('resources/api');
      });
    });
  });

  it('should not have cms widget button', () => {
    expect(cmsComponent.certIdButton('8490').isDisplayed()).toBe(false);
  });

  it('should add listing to compare widget after clicking on compare button', () => {
    compareComponent.addListingToCompare('8490');
    expect(compareComponent.isInList('24/7 smartEMR')).toBeTrue();
  });

  it('should open developer dashboard', () => {
    expect(page.goToDeveloperPageLink('VIPA Health Solutions, LLC').getAttribute('href')).toContain('organizations/developers/');
  });
});

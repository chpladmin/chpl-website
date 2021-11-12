import Hooks from '../../utilities/hooks';
import CmsWidgetComponent from '../../components/cms-widget/cms-widget.po';
import CompareWidgetComponent from '../../components/compare-widget/compare-widget.po';
import LoginComponent from '../../components/login/login.po';

import ListingPage from './listing.po';

let cmsComponent;
let compareComponent;
let hooks;
let page;
let login;

beforeEach(() => {
  page = new ListingPage();
  hooks = new Hooks();
  cmsComponent = new CmsWidgetComponent();
  compareComponent = new CompareWidgetComponent();
  login = new LoginComponent();
});

describe('when on 2015 listing page', () => {
  beforeEach(() => {
    hooks.open('#/listing/9833');
    hooks.waitForSpinnerToDisappear();
  });

  describe('when logged in as a ROLE_ONC', () => {
    beforeEach(async () => {
      login.logIn('onc');
    });

    afterEach(() => {
      login.logOut();
    });

    it('should have correct link for editing a listing', () => {
      expect(page.editCertifiedProduct.getAttribute('href')).toContain('listing/9833/view/edit');
    });
  });

  describe('clicking on return to search link', () => {
    beforeEach(async () => {
      page.returnToSearch.click();
    });

    it('should go back to search page', () => {
      expect(browser.getUrl()).toContain('/search');
    });
  });

  it('should have product history button', () => {
    expect(page.productHistory.isDisplayed()).toBe(true);
  });

  describe('when clicking on product history button', () => {
    beforeEach(() => {
      page.productHistory.click();
    });

    it('should open product history modal', () => {
      expect(page.listingHistoryModalRows().length).toBeGreaterThan(1);
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
      cmsComponent.addToCms('9833').click();
      hooks.waitForSpinnerToDisappear();
      cmsComponent.waitForProcessingSpinnerToDisappear();
    });

    it('should add listing to cms widget', () => {
      expect(cmsComponent.progressBar.isDisplayed()).toBe(true);
    });
  });
  describe('when clicking on compare button', () => {
    beforeEach(async () => {
      compareComponent.addToCompare('9833').click();
    });

    it('should add listing to compare widget', () => {
      expect(compareComponent.compareProductsButton.isDisplayed()).toBe(true);
    });
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
  describe('when clicking on return to search link', () => {
    beforeEach(() => {
      page.returnToSearch.click();
    });

    it('should go back to search page', () => {
      expect(browser.getUrl()).toContain('/search');
    });
  });

  it('should have product history button', () => {
    expect(page.productHistory.isDisplayed()).toBe(true);
  });

  describe('when clicking on product history button', () => {
    beforeEach(() => {
      page.productHistory.click();
    });

    it('should open product history modal', () => {
      expect(page.listingHistoryModalRows().length).toBeGreaterThan(1);
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
    expect(cmsComponent.addToCms('8490').isDisplayed()).toBe(false);
  });

  describe('when clicking on  cms id button', () => {
    beforeEach(() => {
      compareComponent.addToCompare('8490').click();
    });

    it('should add listing to compare widget after clicking on compare button', () => {
      expect(compareComponent.compareProductsButton.isDisplayed()).toBe(true);
    });
  });

  it('should open developer dashboard', () => {
    expect(page.goToDeveloperPageLink('VIPA Health Solutions, LLC').getAttribute('href')).toContain('organizations/developers/');
  });
});

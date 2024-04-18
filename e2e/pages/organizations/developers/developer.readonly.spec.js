import DeveloperPage from './developer.po';
import Hooks from '../../../utilities/hooks';

let hooks;
let page;

describe('the Developer pages', () => {
  describe('for existing Developers', () => {
    beforeEach(async () => {
      browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
      browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
      hooks = new Hooks();
    });

    describe('on the "GE Healthcare" Developer page', () => {
      beforeEach(async () => {
        page = new DeveloperPage();
        const developer = 'GE Healthcare';
        await hooks.open('#/organizations/developers/2070');
      });

      it('should have a Direct Reviews section', () => {
        expect(page.directReviewsHeader).toExist();
      });

      it('should have Products', () => {
        page.selectAllCertificationStatus();
        expect(page.products.length).toBeGreaterThan(0);
      });
    });

    describe('when on the "Breeze EHR" Developer page with only one product', () => {
      beforeEach(async () => {
        page = new DeveloperPage();
        const developer = 'Breeze EHR';
        await hooks.open('#/organizations/developers/169');
      });

      it('should not have split developer button', () => {
        page.selectAllCertificationStatus();
        expect(page.splitDeveloper.isDisplayed()).toBe(false);
      });
    });
  });

  describe('for nonexistent Developers', () => {
    beforeEach(async () => {
      hooks = new Hooks();
      const dummyDeveloperId = '0000';
      await hooks.open(`#/organizations/developers/${dummyDeveloperId}`);
    });

    it('should go to the custom 404 page', () => {
      hooks.waitForSpinnerToDisappear();
      expect(browser.getUrl()).toContain('#/not-found');
    });
  });
});

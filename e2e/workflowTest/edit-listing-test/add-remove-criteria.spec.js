import ListingPage from '../../pages/listing/listing.po';
import Hooks from '../../utilities/hooks';
import CriteriaComponent from '../../components/listing/details/criteria/criteria.po';
import loginComponent from '../../components/login/login.po';
import ActionBarComponent from '../../components/action-bar/action-bar.po';
import ToastComponent from '../../components/toast/toast.po';

let action; let criteria; let hooks; let login; let page; let toast;

describe('On the 2015 Listing page', () => {
  beforeEach(async () => {
    page = new ListingPage();
    hooks = new Hooks();
    toast = new ToastComponent();
    login = new loginComponent();
    criteria = new CriteriaComponent();
    action = new ActionBarComponent();
    await hooks.open('#/listing/9833');
  });

  describe('When ONC logged in', () => {
    beforeEach(async () => {
      login.logIn('onc');
      hooks.waitForSpinnerToDisappear();
    });

    it.skip('should able to unattest attested criteria 170.315 (a)(1)', () => {
      page.editCertifiedProduct.click();
      criteria.expandCriteria('1');
      criteria.editCriteria('1');
      criteria.attestToggle.click();
      criteria.accept.click();
      expect(criteria.chipText('Staged Changes').isDisplayed()).toBe(true);
      page.reason.addValue('test');
      action.save();
      hooks.waitForSpinnerToDisappear();
      page.bypassWarning.click();
      action.save();
      browser.waitUntil(() => toast.toastTitle.isDisplayed());
      expect(toast.toastTitle.getText()).toBe('Update processing');
      hooks.waitForSpinnerToDisappear();
      expect(criteria.criteriaHeader('1').isDisplayed()).toBe(false);
    });

    it.skip('should able to attest unattested criteria 170.315 (b)(7) cures update', () => {
      page.editCertifiedProduct.click();
      criteria.expandCriteria('168');
      criteria.editCriteria('168');
      criteria.attestToggle.click();
      criteria.addTestProcedures('ONC Test Method', '1.1');
      criteria.addTestTools('Cypress', '1.1');
      criteria.addTestTools('Edge Testing Tool', '2.1');
      criteria.addPrivacySecurity('Approach 1');
      criteria.accept.scrollAndClick();
      expect(criteria.chipText('Staged Changes').isDisplayed()).toBe(true);
      action.save();
      hooks.waitForSpinnerToDisappear();
      page.bypassWarning.click();
      action.save();
      browser.waitUntil(() => toast.toastTitle.isDisplayed());
      expect(toast.toastTitle.getText()).toBe('Update processing');
      hooks.waitForSpinnerToDisappear();
      expect(criteria.criteriaHeader('168').isDisplayed()).toBe(true);
    });
  });
});

import ListingPage from '../../pages/listing/listing.po';
import Hooks from '../../utilities/hooks';
import CriteriaComponent from '../../components/listing/details/criteria/criteria.po';
import LoginComponent from '../../components/login/login.sync.po';
import ActionBarComponent from '../../components/action-bar/action-bar.po';
import ToastComponent from '../../components/toast/toast.po';

let action;
let criteria;
let hooks;
let login;
let page;
let toast;

describe('On the 2015 Listing page', () => {
  beforeEach(async () => {
    page = new ListingPage();
    hooks = new Hooks();
    toast = new ToastComponent();
    login = new LoginComponent();
    criteria = new CriteriaComponent();
    action = new ActionBarComponent();
    await hooks.open('#/listing/10599');
  });

  describe('When ONC logged in', () => {
    beforeEach(async () => {
      login.logIn('onc');
      page.editCertifiedProduct.click();
      hooks.waitForSpinnerToDisappear();
    });

    afterEach(async () => {
      login.logOut();
    });
    it('should able to unattest attested criteria 170.315 (d)(3) cures update', () => {
      if (criteria.uiUpgradeFlag()) {
        criteria.expandCriteria('174');
        criteria.editCriteria('174');
        criteria.attestToggle.click();
        criteria.accept.click();
        expect(criteria.chipText('Staged Changes').isDisplayed()).toBe(true);
      } else {
        criteria.openAttestedCriteriaOld('170.315 (d)(3)', true);
        criteria.attestCriteriaOld('170.315 (d)(3)');
        criteria.saveCertifiedProductOld.waitAndClick();
      }
      page.reason.addValue('test');
      action.save();
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => toast.toastTitle.isDisplayed());
      expect(toast.toastTitle.getText()).toBe('CHPL ID Changed' || 'Update processing');
      toast.clearAllToast();
      hooks.waitForSpinnerToDisappear();
      expect(criteria.criteriaHeader('174', '170.315 (d)(3)', true).isDisplayed()).toBe(false);
    });

    it('should able to attest unattested criteria 170.315 (g)(6) cures update', () => {
      if (criteria.uiUpgradeFlag()) {
        criteria.expandCriteria('180');
        criteria.editCriteria('180');
        criteria.attestToggle.click();
        hooks.waitForSpinnerToDisappear();
        criteria.addTestProcedures('ONC Test Method', '1.1');
        criteria.addTestTools('Not Applicable', '1.1');
        criteria.addTestTools('Edge Testing Tool', '2.1');
        criteria.accept.click();
        expect(criteria.chipText('Staged Changes').isDisplayed()).toBe(true);
      } else {
        criteria.openUnattestedCriteriaOld('170.315 (g)(6)', true);

        criteria.attestCriteriaOld('170.315 (g)(6)');
        criteria.addTestProceduresOld('ONC Test Method', '1.1');
        criteria.addTestToolsOld('Edge Testing Tool', '1.1');
        criteria.saveCertifiedProductOld.waitAndClick();
      }
      action.save();
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => toast.toastTitle.isDisplayed());
      expect(toast.toastTitle.getText()).toBe('Update processing');
      toast.clearAllToast();
      hooks.waitForSpinnerToDisappear();
      expect(criteria.criteriaHeader('180', '170.315 (g)(6)', true).isDisplayed()).toBe(true);
    });
  });
});

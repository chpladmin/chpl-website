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

/* ignore these tests until OCD-4227 is done */
xdescribe('On the 2015 Listing page', () => {
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
      criteria.editCriteriaButton('170.315 (d)(3)', 174).scrollIntoView({ block: 'center', inline: 'center' });
      criteria.openAttestedCriteria('170.315 (d)(3)', 174);
      criteria.attestCriteria('170.315 (d)(3)');
      criteria.saveCertifiedProductOld.click();
      page.reason.addValue('test');
      action.save();
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => toast.toastTitle.isDisplayed());
      expect(toast.toastTitle.getText()).toBe('CHPL ID Changed' || 'Update processing');
      toast.clearAllToast();
      hooks.waitForSpinnerToDisappear();
      expect(criteria.criteriaHeader('174').isDisplayed()).toBe(false);
    });

    it('should able to attest unattested criteria 170.315 (g)(6) cures update', () => {
      criteria.editCriteriaButton('170.315 (g)(6)', 174).scrollIntoView({ block: 'center', inline: 'center' });
      criteria.openUnattestedCriteria('170.315 (g)(6)', 174);
      criteria.attestCriteria('170.315 (g)(6)');
      criteria.addConformanceMethodsOld('ONC Test Procedure', '1.1');
      criteria.addTestToolsOld('Edge Testing Tool', '1.1');
      criteria.saveCertifiedProductOld.click();
      action.save();
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => toast.toastTitle.isDisplayed());
      expect(toast.toastTitle.getText()).toBe('Update processing');
      toast.clearAllToast();
      hooks.waitForSpinnerToDisappear();
      expect(criteria.criteriaHeader('180').isDisplayed()).toBe(true);
    });
  });
});

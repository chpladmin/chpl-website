import ListingPage from '../../../../pages/listing/listing.po';
import Hooks from '../../../../utilities/hooks';
import CriteriaComponent from './criteria.po';
import loginComponent from '../../../login/login.po';
import ActionBarComponent from '../../../action-bar/action-bar.po';
import ToastComponent from '../../../toast/toast.po';

let action; let criteria; let hooks; let login; let page; let toast;

describe('On the Listing page', () => {
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

    it('should able to unattest attested criteria 170.315 (a)(1)', () => {
      page.editCertifiedProduct.click();
      criteria.expandCriteria('1');
      criteria.editCriteria.click();
      criteria.attestToggle.click();
      criteria.accept.click();
      expect(criteria.chipText('Staged Changes').isDisplayed()).toBe(true);
      page.reason.addValue('test');
      action.save();
      hooks.waitForSpinnerToDisappear();
      $('#acknowledge-warnings').click();
      action.save();
      browser.waitUntil(() => toast.toastTitle.isDisplayed());
      expect(toast.toastTitle.getText()).toBe('Update processing');
      hooks.waitForSpinnerToDisappear();
      expect(criteria.criteriaHeader('1').isDisplayed()).toBe(false);
    });
  });
});

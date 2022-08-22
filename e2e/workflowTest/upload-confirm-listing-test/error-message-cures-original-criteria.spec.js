import Upload from '../../components/upload/upload-listing/upload-listing.po';
import Confirm from '../../pages/administration/confirm/confirm.po';
import LoginComponent from '../../components/login/login.sync.po';
import ActionBarComponent from '../../components/action-bar/action-bar.po';
import Hooks from '../../utilities/hooks';

let confirm;
let hooks;
let loginComponent;
let upload;
let actionBar;

describe('when ACB inspects uploaded listing with both cures and original criteria', () => {
  it('should show correct error message', () => {
    upload = new Upload();
    confirm = new Confirm();
    loginComponent = new LoginComponent();
    actionBar = new ActionBarComponent();
    hooks = new Hooks();
    hooks.open('#/administration/upload');
    loginComponent.logIn('acb');
    upload.uploadFileAndWaitForListingsToBeProcessed('../../../resources/listings/2015_v19_AQA3.csv', ['15.04.04.1722.AQA5.03.01.1.200620'], hooks, confirm);
    confirm.gotoPendingListingPage('15.04.04.1722.AQA5.03.01.1.200620');
    hooks.waitForSpinnerToDisappear();
    actionBar.waitForMessages();
    const errors = actionBar.errors.map((item) => item.getText());
    expect(errors.includes('Cannot select both 170.315 (b)(3) and 170.315 (b)(3) (Cures Update).')).toBe(true);
  });
});

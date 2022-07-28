import Upload from '../../components/upload/upload-listing/upload-listing.po';
import Confirm from '../../pages/administration/confirm/confirm.po';
import LoginComponent from '../../components/login/login.sync.po';
import Hooks from '../../utilities/hooks';

let confirm;
let hooks;
let loginComponent;
let upload;

describe('when ACB inspects uploaded listing with both cures and original criteria', () => {
  it('should show correct error message', () => {
    upload = new Upload();
    confirm = new Confirm();
    loginComponent = new LoginComponent();
    hooks = new Hooks();
    hooks.open('#/administration/upload');
    loginComponent.logIn('acb');
    upload.uploadListing('../../../resources/listings/2015_v20_AQA5.csv', true);
    hooks.open('#/administration/confirm/listings');
    browser.waitUntil(() => confirm.isLoaded());
    confirm.gotoPendingListingPage('15.04.04.1722.AQA5.03.01.1.200620', true);
    expect(confirm.errorMessage.getText()).toContain('Cannot select both 170.315 (b)(3) and 170.315 (b)(3) (Cures Update).');
  });
});

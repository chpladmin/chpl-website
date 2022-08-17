import Upload from '../../components/upload/upload-listing/upload-listing.po';
import Confirm from '../../pages/administration/confirm/confirm.po';
import LoginComponent from '../../components/login/login.sync.po';
import Hooks from '../../utilities/hooks';

let confirm;
let hooks;
let loginComponent;
let upload;
const listingId = '15.04.04.1722.AQA3.03.01.1.200620';

beforeEach(() => {
  upload = new Upload();
  confirm = new Confirm();
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  hooks.open('#/administration/upload');
  loginComponent.logIn('acb');
  upload.uploadFileAndWaitForListingsToBeProcessed('../../../resources/listings/2015_v19_AQA3.csv', [listingId], hooks, confirm);
});

describe('when user rejects a listing while inspecting uploaded listing', () => {
  it('should allow listing to get rejected', () => {
    confirm.gotoPendingListingPage(listingId);
    hooks.waitForSpinnerToDisappear();
    confirm.rejectButtonOnInspectListing.click();
    confirm.yesConfirmation.click();
    browser.waitUntil(() => !confirm.inspectLabel.isDisplayed());
    hooks.waitForSpinnerToDisappear();
    expect(confirm.findListingToReject(listingId).isDisplayed()).toBe(false);
  });
});

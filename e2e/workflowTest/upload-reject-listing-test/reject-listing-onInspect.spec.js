import Upload from '../../pages/administration/upload/upload.po';
import Confirm from '../../pages/administration/confirm/confirm.po';
import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';

let confirm;
let hooks;
let loginComponent;
let upload;
const listingId = '15.04.04.1722.AQA3.03.01.1.200620';

beforeAll(() => {
  upload = new Upload();
  confirm = new Confirm();
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  hooks.open('#/administration/upload');
  loginComponent.logIn('acb');
browser.saveScreenshot(`test_reports/e2e/screenshot/${Date.now()}.png`);
  upload.uploadListing('../../../resources/listings/2015_v19_AQA3.csv', true);
browser.saveScreenshot(`test_reports/e2e/screenshot/${Date.now()}.png`);
  hooks.open('#/administration/confirm/listings');
browser.saveScreenshot(`test_reports/e2e/screenshot/${Date.now()}.png`);
  browser.waitUntil(() => confirm.isLoaded());
browser.saveScreenshot(`test_reports/e2e/screenshot/${Date.now()}.png`);
});

describe('when user rejects a listing while inspecting uploaded listing', () => {
  it('should allow listing to get rejected', () => {
browser.saveScreenshot(`test_reports/e2e/screenshot/${Date.now()}.png`);
    confirm.gotoPendingListingPage(listingId, true);
browser.saveScreenshot(`test_reports/e2e/screenshot/${Date.now()}.png`);
    hooks.waitForSpinnerToDisappear();
browser.saveScreenshot(`test_reports/e2e/screenshot/${Date.now()}.png`);
    confirm.rejectButtonOnInspectListing.click();
browser.saveScreenshot(`test_reports/e2e/screenshot/${Date.now()}.png`);
    confirm.yesConfirmation.click();
browser.saveScreenshot(`test_reports/e2e/screenshot/${Date.now()}.png`);
    browser.waitUntil(() => !confirm.inspectLabel.isDisplayed());
browser.saveScreenshot(`test_reports/e2e/screenshot/${Date.now()}.png`);
    hooks.waitForSpinnerToDisappear();
browser.saveScreenshot(`test_reports/e2e/screenshot/${Date.now()}.png`);
    expect(confirm.findListingToReject(listingId).isDisplayed()).toBe(false);
  });
});

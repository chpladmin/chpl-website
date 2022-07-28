import UploadListingComponent from '../../../components/upload/upload-listing/upload-listing.po';
import LoginComponent from '../../../components/login/login.sync.po';
import Hooks from '../../../utilities/hooks';
import ToastComponent from '../../../components/toast/toast.po';

import ConfirmPage from './confirm.po';

let confirm;
let hooks;
let loginComponent;
let toast;
let upload;
const rejectListingId1 = '15.04.04.1722.AQA3.03.01.1.200620';
const rejectListingId2 = '15.04.04.1722.AQA4.03.01.1.200620';

describe('when user is on confirm listing page', () => {
  beforeEach(() => {
    upload = new UploadListingComponent();
    confirm = new ConfirmPage();
    loginComponent = new LoginComponent();
    toast = new ToastComponent();
    hooks = new Hooks();
    hooks.open('#/administration/upload');
    loginComponent.logIn('drummond');
  });

  afterEach(() => {
    toast.clearAllToast();
    loginComponent.logOut();
  });

  describe('and uploading a listing', () => {
    beforeEach(() => {
      upload.uploadListing('../../../resources/listings/2015_v19_AQA3.csv', true);
    });

    it('should allow user to reject a file', () => {
      hooks.open('#/administration/confirm/listings');
      browser.waitUntil(() => confirm.isLoaded());
      confirm.rejectListing(rejectListingId1, true);
      browser.waitUntil(() => !confirm.findListingToReject(rejectListingId1).isDisplayed());
      expect(confirm.findListingToReject(rejectListingId1).isDisplayed()).toBe(false);
    });
  });

  describe('and uploading multiple listing', () => {
    beforeEach(() => {
      upload.uploadListing('../../../resources/listings/2015_v19_AQA3.csv', true);
      upload.uploadListing('../../../resources/listings/2015_v19_AQA4.csv', true);
    });

    it('should allow user to mass reject multiple listings', () => {
      hooks.open('#/administration/confirm/listings');
      browser.waitUntil(() => confirm.isLoaded());
      confirm.rejectListingCheckbox(rejectListingId1, true);
      confirm.rejectListingCheckbox(rejectListingId2, true);
      confirm.rejectButton.waitAndClick();
      browser.waitUntil(() => !confirm.findListingToReject(rejectListingId1).isDisplayed());
      browser.waitUntil(() => !confirm.findListingToReject(rejectListingId1).isDisplayed());
      expect(confirm.findListingToReject(rejectListingId1).isDisplayed()).toBe(false);
      expect(confirm.findListingToReject(rejectListingId2).isDisplayed()).toBe(false);
    });
  });
});

// This test is using AQA3 and AQA4 upload listing

import UploadPage from '../../pages/administration/upload/upload.po';
import ConfirmPage from '../../pages/administration/confirm/confirm.po';
import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';

let confirmPage , hooks, loginComponent, uploadPage;
const listingId = '15.04.04.1722.AQA3.03.01.1.200620';

// **Run once before the first test case**
beforeAll( () => {
    uploadPage = new UploadPage();
    confirmPage = new ConfirmPage();
    loginComponent = new LoginComponent();
    hooks = new Hooks();
    hooks.open('#/administration/upload');
    loginComponent.logIn('acb');
    uploadPage.uploadListing('../../../resources/2015_v19_AQA3.csv');
    uploadPage.waitForSuccessfulUpload('AQA3');
    hooks.open('#/administration/confirm/listings');
});

describe('When user rejects a listing while inspecting uploaded listing', () => {

    it('should allow listing to get rejected', () => {
        confirmPage.gotoConfirmListingPage(listingId);
        confirmPage.rejectButtonOnInspectListing.click();
        confirmPage.yesConfirmation.click();
        hooks.waitForSpinnerToDisappear();
        assert.isFalse(confirmPage.findListingtoReject(listingId).isDisplayed());
    });
});

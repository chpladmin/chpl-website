// This test is using AQA3 upload file

import ConfirmPage from './confirm.po';
import UploadPage from '../upload/upload.po';
import LoginComponent from '../../../components/login/login.po';
import Hooks from '../../../utilities/hooks';

let confirmPage, hooks, loginComponent, uploadPage;
const rejectListingId1 = '15.04.04.1722.AQA3.03.01.1.200620';
const rejectListingId2 = '15.04.04.1722.AQA4.03.01.1.200620';

describe('when user is on confirm listing page', () => {
    beforeEach(() => {
        uploadPage = new UploadPage();
        confirmPage = new ConfirmPage();
        loginComponent = new LoginComponent();
        hooks = new Hooks();
        hooks.open('#/administration/upload');
        loginComponent.logIn('acb');
    });

    afterEach(() => {
        loginComponent.openLoginComponent();
        loginComponent.logOut();
    });

    describe('and uploading a listing', () => {
        beforeEach(() => {
            uploadPage.uploadListing('../../../resources/2015_v19_AQA3.csv');
            uploadPage.waitForSuccessfulUpload();
        });

        it('should allow user to reject a file', () => {
            hooks.open('#/administration/confirm/listings');
            confirmPage.rejectListing(rejectListingId1);
            assert.isFalse(confirmPage.findListingtoReject(rejectListingId1).isDisplayed());
        });
    });

    describe('and uploading multiple listing', () => {
        beforeEach(() => {
            uploadPage.uploadListing('../../../resources/2015_v19_AQA3.csv');
            uploadPage.waitForSuccessfulUpload();
            hooks.open('#/administration/upload');
            uploadPage.uploadListing('../../../resources/2015_v19_AQA4.csv');
            hooks.waitForSpinnerToDisappear();
        });

        it('should allow user to mass reject multiple listings', () => {
            hooks.open('#/administration/confirm/listings');
            confirmPage.rejectCheckbox(rejectListingId1).scrollAndClick();
            confirmPage.rejectCheckbox(rejectListingId2).scrollAndClick();
            confirmPage.rejectButton.waitAndClick();
            confirmPage.yesConfirmation.waitAndClick();
            assert.isFalse(confirmPage.findListingtoReject(rejectListingId1).isDisplayed());
            assert.isFalse(confirmPage.findListingtoReject(rejectListingId2).isDisplayed());
        });
    });
});

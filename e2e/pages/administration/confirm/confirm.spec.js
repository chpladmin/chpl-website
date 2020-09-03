// This test is using AQA3 upload file

import ConfirmPage from './confirm.po';
import UploadPage from '../upload/upload.po';
import LoginComponent from '../../../components/login/login.po';
import Hooks from '../../../utilities/hooks';

let confirmPage, hooks, loginComponent, uploadPage;
const rejectListingId = '15.04.04.1722.AQA3.03.01.1.200620';

beforeEach(() => {
    uploadPage = new UploadPage();
    confirmPage = new ConfirmPage();
    loginComponent = new LoginComponent();
    hooks = new Hooks();
    hooks.open('#/administration/upload');
    loginComponent.loginAsACB();
    uploadPage.uploadListing('../../../resources/2015_v19_AQA3.csv');
    uploadPage.waitForSuccessfulUpload();
});

describe('Confirm page', () => {

    it('allows user to reject a file', () => {
        hooks.open('#/administration/confirm/listings');
        confirmPage.rejectListing(rejectListingId);
        assert.isFalse(confirmPage.findListingtoReject(rejectListingId).isDisplayed())
    });

});

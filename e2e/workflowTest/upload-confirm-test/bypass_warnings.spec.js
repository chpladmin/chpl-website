// This test is using AQA1 and AQA4 upload listing

import UploadPage from '../../pages/administration/upload/upload.po';
import ConfirmPage from '../../pages/administration/confirm/confirm.po';
import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';

let confirmPage , hooks, loginComponent, uploadPage;

// **Run once before the first test case**
beforeAll( () => {
    uploadPage = new UploadPage();
    confirmPage = new ConfirmPage();
    loginComponent = new LoginComponent();
    hooks = new Hooks();
    hooks.open('#/administration/upload');
    loginComponent.loginAsACB();
})

describe('Confirming a listing', () => {
    // **Run once before each test case**
    beforeEach(function () {
        uploadPage.uploadListing('../../../resources/2015_v19_AQA1.csv');
        uploadPage.waitForSuccessfulUpload();
        hooks.open('#/administration/confirm/listings')
    })

    it('should not show warning bypass checkbox when upload listing file doesnt have warnings', () => {
        confirmPage.gotoConfirmListingPage('15.04.04.1722.AQA1.03.01.1.200620');
        assert.isFalse(confirmPage.warningCheckbox.isDisplayed());
    })
})

describe('Confirming a listing', () => {

    beforeAll(function () {
        hooks.open('#/administration/upload');
        uploadPage.uploadListing('../../../resources/2015_v19_AQA4.csv');
        uploadPage.waitForSuccessfulUpload();
        hooks.open('#/administration/confirm/listings');
    })

    it('should show warning bypass checkbox when upload listing file has warnings', () => {
        confirmPage.gotoConfirmListingPage('15.04.04.1722.AQA4.03.01.1.200620');
        expect(confirmPage.warningCheckbox.isDisplayed()).toBe(true);
    })

    it('works successfully when user clicks on bypass warnings', () => {
        confirmPage.gotoConfirmListingPage('15.04.04.1722.AQA4.03.01.1.200620');
        confirmPage.warningCheckbox.click();
        confirmPage.confirmListing();
        confirmPage.waitForSuccessfulConfirm();
        assert.equal(confirmPage.toastContainerTitle.getText(),'Update processing');
    })

})

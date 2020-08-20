// This test is using AQA3 and AQA4 upload listing

import UploadPage from '../../pages/administration/upload/upload.po';
import ConfirmPage from '../../pages/administration/confirm/confirm.po';
import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';

let confirmPage , hooks, loginComponent, uploadPage;
const listingIdNoWarningError = '15.04.04.1722.AQA3.03.01.1.200620';
const listingIdWithWarning = '15.04.04.1722.AQA4.03.01.1.200620';

// **Run once before the first test case**
beforeAll( () => {
    uploadPage = new UploadPage();
    confirmPage = new ConfirmPage();
    loginComponent = new LoginComponent();
    hooks = new Hooks();
    hooks.open('#/administration/upload');
    loginComponent.loginAsACB();
})

describe('listing with no confirm warnings and no errors', () => {
    // **Run once before each test case**
    beforeEach(function () {
        uploadPage.uploadListing('../../../resources/2015_v19_AQA3.csv');
        uploadPage.waitForSuccessfulUpload();
        hooks.open('#/administration/confirm/listings')
    })

    it('should not show warning bypass checkbox and confirm works successfully', () => {
        confirmPage.gotoConfirmListingPage(listingIdNoWarningError);
        confirmPage.confirmListing();
        assert.isFalse(confirmPage.warningCheckbox.isDisplayed());
        confirmPage.waitForSuccessfulConfirm();
        assert.equal(confirmPage.toastContainerTitle.getText(),'Update processing');
    })
})

describe('listing with warnings on confirm and no errors', () => {

    beforeAll(function () {
        hooks.open('#/administration/upload');
        uploadPage.uploadListing('../../../resources/2015_v19_AQA4.csv');
        uploadPage.waitForSuccessfulUpload();
        hooks.open('#/administration/confirm/listings');
    })

    it('should show warning bypass checkbox while confirming', () => {
        confirmPage.gotoConfirmListingPage(listingIdWithWarning);
        confirmPage.confirmListing();
        hooks.waitForSpinnerToDisappear();
        assert.isTrue(confirmPage.warningCheckbox.isDisplayed());
    })

    it('should not get confirmed until bypasscheckbox is checked', () => {
        confirmPage.gotoConfirmListingPage(listingIdWithWarning);
        confirmPage.confirmListing();
        browser.waitUntil( () => confirmPage.warningCheckbox.isDisplayed());
        confirmPage.confirmListing();
        hooks.waitForSpinnerToDisappear();
        assert.isTrue(confirmPage.confirmButton.isDisplayed());
    })

    it('should get confirm if user checks checbox for bypass warnings', () => {
        confirmPage.gotoConfirmListingPage(listingIdWithWarning);
        confirmPage.confirmListing();
        hooks.waitForSpinnerToDisappear();
        confirmPage.warningCheckbox.click();
        confirmPage.confirmListing();
        confirmPage.waitForSuccessfulConfirm();
        assert.equal(confirmPage.toastContainerTitle.getText(),'Update processing');
    })

    afterEach(function () {
        browser.refresh();
    })

})

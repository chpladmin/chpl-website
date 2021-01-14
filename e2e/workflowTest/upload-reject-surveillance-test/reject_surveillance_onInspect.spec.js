import UploadSurveillanceComponent from '../../components/upload/upload-surveillance/upload-surveillance.po';
import ConfirmPage from '../../pages/surveillance/confirm/confirm.po';
import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';

let confirmPage, hooks, loginComponent, upload;
const listingId = '15.04.04.2988.Heal.PC.01.1.181101';

beforeEach(async () => {
    loginComponent = new LoginComponent();
    confirmPage = new ConfirmPage();
    upload = new UploadSurveillanceComponent();
    hooks = new Hooks();
    hooks.open('#/surveillance/upload');
    loginComponent.logInWithEmail('acb');
    upload.uploadSurveillance('../../../resources/surveillance/SAQA1.csv');
    hooks.open('#/surveillance/confirm');
    hooks.waitForSpinnerToDisappear();
});

describe('When user rejects a surveillance activity while inspecting uploaded surveillance', () => {

    it('should allow activity to get rejected', () => {
        browser.waitUntil( () => confirmPage.table.isDisplayed());
        var countBefore = confirmPage.tableRowCount.length;
        confirmPage.inspectButton(listingId);
        confirmPage.rejectOnInspectButton.click();
        confirmPage.yesConfirmation.click();
        hooks.waitForSpinnerToDisappear();
        var countAfter = confirmPage.tableRowCount.length;
        assert.isAtMost(countAfter,countBefore);
    });
});

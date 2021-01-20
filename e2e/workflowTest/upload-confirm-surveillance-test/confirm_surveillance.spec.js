import UploadSurveillanceComponent from '../../components/upload/upload-surveillance/upload-surveillance.po';
import ConfirmPage from '../../pages/surveillance/confirm/confirm.po';
import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';
import ToastComponent from '../../components/toast/toast.po';
import { assert } from 'chai';

let confirmPage, hooks, loginComponent, toast, upload;
const listingId = '15.04.04.2988.Heal.PC.01.1.181101';

beforeEach(async () => {
    loginComponent = new LoginComponent();
    toast = new ToastComponent();
    confirmPage = new ConfirmPage();
    upload = new UploadSurveillanceComponent();
    hooks = new Hooks();
    hooks.open('#/surveillance/upload');
    loginComponent.logInWithEmail('acb');
    upload.uploadSurveillance('../../../resources/surveillance/SAQA1.csv');
    hooks.open('#/surveillance/confirm');
    hooks.waitForSpinnerToDisappear();
});

describe('User can confirm', () => {

    it('surveillance activity successfully', () => {
        browser.waitUntil( () => confirmPage.table.isDisplayed());
        confirmPage.inspectButton(listingId);
        confirmPage.confirmButton.click();
        confirmPage.yesConfirmation.click();
        hooks.waitForSpinnerToDisappear();
        browser.waitUntil( () => toast.toastContainer.isDisplayed());
        assert.equal(toast.toastTitle.getText() , 'Update processing');
    });
});

import UploadSurveillanceComponent from '../../components/upload/upload-surveillance/upload-surveillance.po';
import ConfirmPage from '../../pages/surveillance/confirm/confirm.po';
import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';
import ToastComponent from '../../components/toast/toast.po';
import SurveillanceEditComponent from '../../components/surveillance/edit/surveillanceEdit.po';
import { assert } from 'chai';

let confirmPage, edit, hooks, loginComponent, toast, upload;
const listingId = '15.04.04.2988.Heal.PC.01.1.181101';

beforeEach(async () => {
    loginComponent = new LoginComponent();
    toast = new ToastComponent();
    edit = new SurveillanceEditComponent();
    confirmPage = new ConfirmPage();
    upload = new UploadSurveillanceComponent();
    hooks = new Hooks();
    hooks.open('#/surveillance/upload');
    loginComponent.logInWithEmail('acb');
    upload.uploadSurveillance('../../../resources/surveillance/SAQA1.csv');
    hooks.open('#/surveillance/confirm');
    hooks.waitForSpinnerToDisappear();
});

afterEach(() => {
    if (toast.toastContainer.isDisplayed()) {
        toast.clearAllToast();
    }
    else {
        edit.cancel.click();
        confirmPage.yesConfirmation.click();
    }
    loginComponent.logOut();
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

describe('User can\'t confirm', () => {

    it('surveillance activity when they add certified requirement which listing is not attested to', () => {
        browser.waitUntil( () => confirmPage.table.isDisplayed());
        confirmPage.inspectButton(listingId);
        hooks.waitForSpinnerToDisappear();
        edit.editSurveillance();
        edit.newRequirementButton.click();
        edit.requirementType.selectByVisibleText('Certified Capability');
        edit.reuirementCapability.selectByVisibleText('170.315 (g)(10): Standardized API for Patient and Population Services');
        edit.requirementResult.selectByVisibleText('No Non-Conformity');
        edit.saveButton.click();
        edit.saveButton.click();

        confirmPage.confirmButton.click();
        confirmPage.yesConfirmation.click();
        browser.waitUntil( () => confirmPage.errorOnConfirm.isDisplayed());
        assert.include(confirmPage.errorOnConfirm.getText(),'The requirement \'170.315 (g)(10)\' is not valid for requirement type \'Certified Capability\'. Valid values are any criterion this product has attested to.');
    });
});

describe('User can\'t confirm', () => {

    it('surveillance activity when they add non conformity type which listing is not attested to', () => {
        let nonconformitydetails = {
            type: '170.315 (g)(10): Standardized API for Patient and Population Services',
            status: 'Open',
            determinationDate: '01/01/2020',
            summary: 'test summary',
            findings: 'test findings',
            approvalDate: '01/01/2020',
            startDate: '01/01/2019',
            completeDate: '01/01/2020',
            explanation: 'Test explanation',
            resolution: 'Test resolution',
        };
        browser.waitUntil( () => confirmPage.table.isDisplayed());
        confirmPage.inspectButton(listingId);
        hooks.waitForSpinnerToDisappear();
        edit.editSurveillance();
        edit.editRequirement.click();
        edit.newNonConformityButton.click();
        edit.addNonConformity(nonconformitydetails , 'Reactive');
        edit.saveButton.scrollAndClick();
        edit.saveButton.scrollAndClick();
        edit.saveButton.scrollAndClick();
        confirmPage.confirmButton.click();
        confirmPage.yesConfirmation.click();
        browser.waitUntil( () => confirmPage.errorOnConfirm.isDisplayed());
        assert.include(confirmPage.errorOnConfirm.getText(),'Nonconformity type \'170.315 (g)(10)\' must match either a criterion the surveilled product has attested to or one of the following: \'170.523 (k)(1)\', \'170.523 (k)(2)\', \'170.523 (l)\', or \'Other Non-Conformity\'.');
    });
});

import UploadSurveillanceComponent from '../../components/upload/upload-surveillance/upload-surveillance.po';
import ConfirmPage from '../../pages/surveillance/confirm/confirm.po';
import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';
import EditComponent from '../../components/surveillance/manage/edit.po';
import { assert } from 'chai';

let confirmPage, edit, hooks, loginComponent, upload;
const listingId = '15.04.04.2988.Heal.PC.01.1.181101';
const error = 'At least one Non-Conformity must be documented';

beforeAll(async () => {
    loginComponent = new LoginComponent();
    edit = new EditComponent();
    confirmPage = new ConfirmPage();
    upload = new UploadSurveillanceComponent();
    hooks = new Hooks();
    hooks.open('#/surveillance/upload');
    loginComponent.logInWithEmail('acb');
    upload.uploadSurveillance('../../../resources/surveillance/SAQA1.csv');
    hooks.open('#/surveillance/confirm');
    hooks.waitForSpinnerToDisappear();
});

describe('On Surveillance edit page - when ACB removes non conformity from a requirement with non conformity', () => {

    it('shows an error', () => {
        browser.waitUntil( () => confirmPage.table.isDisplayed());
        confirmPage.inspectButton(listingId);
        hooks.waitForSpinnerToDisappear();
        edit.editButton.scrollAndClick();
        hooks.waitForSpinnerToDisappear();
        edit.editRequirement.click();
        edit.removeNonconformity.click();
        edit.saveButton.click();
        assert.include(edit.errorMessages.getText(),error);

    });
});

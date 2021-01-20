import UploadSurveillanceComponent from '../../components/upload/upload-surveillance/upload-surveillance.po';
import ConfirmPage from '../../pages/surveillance/confirm/confirm.po';
import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';
import EditComponent from '../../components/surveillance/manage/edit.po';
import { assert } from 'chai';

let confirmPage, edit, hooks, loginComponent, upload;
const listingId = '15.04.04.2988.Heal.PC.01.1.181101';
const inputs = require('../../components/surveillance/manage/requirement-dp');

beforeEach(async () => {
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
    browser.waitUntil( () => confirmPage.table.isDisplayed());
    confirmPage.inspectButton(listingId);
    hooks.waitForSpinnerToDisappear();
});

afterEach(() =>{
    edit.cancel.click();
    confirmPage.yesConfirmation.click();
    if (edit.cancel.isDisplayed())
    {
        edit.cancel.click();
        confirmPage.yesConfirmation.click();
    }
    if (edit.cancel.isDisplayed())
    {
        edit.cancel.click();
        confirmPage.yesConfirmation.click();
    }
    loginComponent.logOut();
});

describe('On Surveillance edit page - ACB can', () => {
    inputs.forEach(input => {
        let testName = input.testName;

        it(`${testName} without non conformity`, () => {

            var countBefore = edit.requirementTable().length;
            edit.editButton.click();
            edit.newRequirementButton.click();
            edit.requirementType.selectByVisibleText(input.type);
            if (input.type === 'Other Requirement') {
                $(input.capabilitySelector).setValue(input.capability);
            }
            else
            {
                $(input.capabilitySelector).selectByVisibleText(input.capability);
            }
            edit.requirementResult.selectByVisibleText('No Non-Conformity');
            edit.saveButton.click();
            edit.saveButton.click();
            var countAfter = edit.requirementTable().length;
            assert.equal(countAfter,countBefore + 1);
        });
    });
});

describe('On Surveillance edit page - ACB can', () => {
    inputs.forEach(input => {
        let testName = input.testName;

        it(`${testName} with non conformity`, () => {
            let nonconformitydetails = {
                type: '170.314 (a)(1): Computerized provider order entry',
                status: 'Open',
                date: '01/01/2020',
                summary: 'test summary',
                findings: 'test findings',
            };
            var countBefore = edit.requirementTable().length;
            edit.editButton.click();
            edit.newRequirementButton.click();
            edit.requirementType.selectByVisibleText(input.type);
            if (input.type === 'Other Requirement') {
                $(input.capabilitySelector).setValue(input.capability);
            }
            else
            {
                $(input.capabilitySelector).selectByVisibleText(input.capability);
            }
            edit.requirementResult.selectByVisibleText('Non-Conformity');
            edit.newNonConformityButton.click();
            edit.nonconformityType.selectByVisibleText(nonconformitydetails.type);
            edit.nonconformityStatus.selectByVisibleText(nonconformitydetails.status);
            edit.determinationDate.setValue(nonconformitydetails.date);
            edit.summary.setValue(nonconformitydetails.summary);
            edit.findings.setValue(nonconformitydetails.findings);
            edit.saveButton.scrollAndClick();
            assert.equal(edit.nonconformityTable().length,1);
            edit.saveButton.scrollAndClick();
            var countAfter = edit.requirementTable().length;
            assert.equal(countAfter,countBefore + 1);
        });
    });
});
describe('On Surveillance edit page - ACB can not', () => {
    inputs.forEach(input => {
        let testName = input.testName;

        it(`${testName} as non conformity without adding non conformity`, () => {
            edit.editButton.click();
            edit.newRequirementButton.click();
            edit.requirementType.selectByVisibleText(input.type);
            if (input.type === 'Other Requirement') {
                $(input.capabilitySelector).setValue(input.capability);
            }
            else
            {
                $(input.capabilitySelector).selectByVisibleText(input.capability);
            }
            edit.requirementResult.selectByVisibleText('Non-Conformity');
            edit.saveButton.click();
            assert.include(edit.errorMessages.getText(),'At least one Non-Conformity must be documented');
        });
    });

});

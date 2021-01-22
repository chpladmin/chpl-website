import UploadSurveillanceComponent from '../../components/upload/upload-surveillance/upload-surveillance.po';
import ConfirmPage from '../../pages/surveillance/confirm/confirm.po';
import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';
import SurveillanceEditComponent from '../../components/surveillance/edit/surveillanceEdit.po';
import { assert } from 'chai';

let confirmPage, edit, hooks, loginComponent, upload;
const listingId = '15.04.04.2988.Heal.PC.01.1.181101';
const listingId1 = '15.04.04.2496.ARIA.16.03.1.200623';
const inputs = require('../../components/surveillance/edit/requirement-dp');

beforeEach(async () => {
    loginComponent = new LoginComponent();
    edit = new SurveillanceEditComponent();
    confirmPage = new ConfirmPage();
    upload = new UploadSurveillanceComponent();
    hooks = new Hooks();
    hooks.open('#/surveillance/upload');
    loginComponent.logInWithEmail('acb');
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
    beforeEach(() =>{
        upload.uploadSurveillance('../../../resources/surveillance/SAQA1.csv');
        hooks.open('#/surveillance/confirm');
        hooks.waitForSpinnerToDisappear();
        browser.waitUntil( () => confirmPage.table.isDisplayed());
        confirmPage.inspectButton(listingId);
        hooks.waitForSpinnerToDisappear();
    });

    inputs.forEach(input => {
        let testName = input.testName;

        it(`${testName} without non conformity`, () => {

            var countBefore = edit.requirementTable().length;
            edit.editSurveillance();
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
    beforeEach(() =>{
        upload.uploadSurveillance('../../../resources/surveillance/SAQA1.csv');
        hooks.open('#/surveillance/confirm');
        hooks.waitForSpinnerToDisappear();
        browser.waitUntil( () => confirmPage.table.isDisplayed());
        confirmPage.inspectButton(listingId);
        hooks.waitForSpinnerToDisappear();
    });

    inputs.forEach(input => {
        let testName = input.testName;

        it(`${testName} with non conformity to reactive surveillance activity`, () => {
            let nonconformitydetails = {
                type: '170.314 (a)(1): Computerized provider order entry',
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
            var countBefore = edit.requirementTable().length;
            edit.editSurveillance();
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
            edit.addNonConformity(nonconformitydetails , 'Reactive');
            assert.isFalse(edit.sites.isEnabled());
            assert.isFalse(edit.totalSites.isEnabled());
            edit.saveButton.scrollAndClick();
            assert.equal(edit.nonconformityTable().length,1);
            edit.saveButton.scrollAndClick();
            var countAfter = edit.requirementTable().length;
            assert.equal(countAfter,countBefore + 1);
        });
    });
});
describe('On Surveillance edit page - ACB can not', () => {
    beforeEach(() =>{
        upload.uploadSurveillance('../../../resources/surveillance/SAQA1.csv');
        hooks.open('#/surveillance/confirm');
        hooks.waitForSpinnerToDisappear();
        browser.waitUntil( () => confirmPage.table.isDisplayed());
        confirmPage.inspectButton(listingId);
        hooks.waitForSpinnerToDisappear();
    });

    inputs.forEach(input => {
        let testName = input.testName;

        it(`${testName} as non conformity without adding non conformity`, () => {
            edit.editSurveillance.click();
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

describe('On Surveillance edit page - ACB can', () => {
    beforeEach(() =>{
        upload.uploadSurveillance('../../../resources/surveillance/SAQA3.csv');
        hooks.open('#/surveillance/confirm');
        hooks.waitForSpinnerToDisappear();
        browser.waitUntil( () => confirmPage.table.isDisplayed());
        confirmPage.inspectButton(listingId1);
        hooks.waitForSpinnerToDisappear();
    });

    inputs.forEach(input => {
        let testName = input.testName;

        it(`${testName} with non conformity to randomized surveillance activity`, () => {
            let nonconformitydetails = {
                type: '170.314 (a)(1): Computerized provider order entry',
                status: 'Closed',
                determinationDate: '01/01/2020',
                summary: 'Test summary',
                findings: 'Test findings',
                approvalDate: '01/01/2020',
                startDate: '01/01/2019',
                completeDate: '01/01/2020',
                sites: '2',
                totalSites: '2',
                explanation: 'Test explanation',
                resolution: 'Test resolution',
            };
            var countBefore = edit.requirementTable().length;
            edit.editSurveillance();
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
            edit.addNonConformity(nonconformitydetails , 'Randomized');
            edit.saveButton.scrollAndClick();
            assert.equal(edit.nonconformityTable().length,1);
            edit.saveButton.scrollAndClick();
            var countAfter = edit.requirementTable().length;
            assert.equal(countAfter,countBefore + 1);
        });
    });
});

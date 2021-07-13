import UploadSurveillanceComponent from '../../components/upload/upload-surveillance/upload-surveillance.po';
import ConfirmPage from '../../pages/surveillance/confirm/confirm.po';
import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';
import SurveillanceEditComponent from '../../components/surveillance/edit/surveillance-edit.po';
import ToastComponent from '../../components/toast/toast.po';

let confirmPage, edit, hooks, loginComponent, toast, upload;
const listingId = '15.04.04.2988.Heal.PC.01.1.181101';
const listingId1 = '15.04.04.2496.ARIA.16.03.1.200623';
const inputs = require('../../components/surveillance/edit/requirement-dp');
const error = 'At least one Non-Conformity must be documented';
const FIRST_ROW=1;
const STATUS_COL_IDX=2;

beforeEach(async () => {
  loginComponent = new LoginComponent();
  edit = new SurveillanceEditComponent();
  confirmPage = new ConfirmPage();
  upload = new UploadSurveillanceComponent();
  hooks = new Hooks();
  toast = new ToastComponent();
  hooks.open('#/surveillance/upload');
  loginComponent.logIn('drummond');
});

afterEach(() =>{
  while (edit.cancel.isClickable()) {
    edit.cancel.scrollAndClick();
    confirmPage.yesConfirmation.click();
  }
  loginComponent.logOut();
});

describe('when inspecting uploaded surveillance activity, ACB user', () => {
  beforeEach(() =>{
    upload.uploadSurveillance('../../../resources/surveillance/SAQA1.csv');
    browser.waitUntil( () => toast.toastTitle.isDisplayed());
    toast.clearAllToast();
    hooks.open('#/surveillance/confirm');
    hooks.waitForSpinnerToDisappear();
    browser.waitUntil( () => confirmPage.table.isDisplayed());
    confirmPage.inspectButton(listingId);
    hooks.waitForSpinnerToDisappear();
  });

  inputs.forEach(input => {
    let testName = input.testName;

    it(`should be able to ${testName} without non-conformity`, () => {
      var countBefore = edit.requirementTableRows().length;
      edit.editSurveillance();
      edit.addRequirement(input.type, input.capability, 'No Non-Conformity');
      do {
        edit.saveButton.click();
      } while (!confirmPage.confirmButton.isClickable());
      var countAfter = edit.requirementTableRows().length;
      expect(countAfter).toBe(countBefore + 1);
    });

    it(`should be able to ${testName} with non-conformity to reactive surveillance activity`, () => {
      let nonConformitydetails = {
        type: '170.314 (a)(1): Computerized provider order entry',
        determinationDate: '01/01/2020',
        nonConformityClosedDate : '01/01/2021',
        summary: 'test summary',
        findings: 'test findings',
        approvalDate: '01/01/2020',
        startDate: '01/01/2019',
        completeDate: '01/01/2020',
        explanation: 'Test explanation',
        resolution: 'Test resolution',
      };
      var countBefore = edit.requirementTableRows().length;
      edit.editSurveillance();
      edit.addRequirement(input.type, input.capability, 'Non-Conformity');
      edit.addnonConformity(nonConformitydetails , 'Reactive');
      expect(edit.sites.isEnabled()).toBeFalse;
      expect(edit.totalSites.isEnabled()).toBeFalse;
      edit.saveButton.scrollAndClick();
      expect(edit.nonConformityTableRows().length).toEqual(1);
      expect(hooks.getCellValue(FIRST_ROW,STATUS_COL_IDX)).toBe('Closed');
      do {
        edit.saveButton.click();
      } while (!confirmPage.confirmButton.isClickable());
      var countAfter = edit.requirementTableRows().length;
      expect(countAfter).toEqual(countBefore + 1);
    });

    it(`should not be able to ${testName} as non conformity without adding non-conformity`, () => {
      edit.editSurveillance();
      edit.addRequirement(input.type, input.capability, 'Non-Conformity');
      do {
        edit.saveButton.click();
      } while (!edit.errorMessages.isDisplayed());
      expect(edit.errorMessages.getText()).toContain(error);
    });
  });
});

describe('when inspecting uploaded surveillance activity, ACB user', () => {
  beforeEach(() =>{
    upload.uploadSurveillance('../../../resources/surveillance/SAQA3.csv');
    browser.waitUntil( () => toast.toastTitle.isDisplayed());
    toast.clearAllToast();
    hooks.open('#/surveillance/confirm');
    hooks.waitForSpinnerToDisappear();
    browser.waitUntil( () => confirmPage.table.isDisplayed());
    confirmPage.inspectButton(listingId1);
    hooks.waitForSpinnerToDisappear();
  });

  inputs.forEach(input => {
    let testName = input.testName;

    it(`should be able to ${testName} with non-conformity to randomized surveillance activity`, () => {
      let nonConformitydetails = {
        type: '170.314 (a)(1): Computerized provider order entry',
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
      var countBefore = edit.requirementTableRows().length;
      edit.editSurveillance();
      edit.addRequirement(input.type, input.capability, 'Non-Conformity');
      edit.addnonConformity(nonConformitydetails , 'Randomized');
      edit.saveButton.scrollAndClick();
      expect(edit.nonConformityTableRows().length).toEqual(1);
      expect(hooks.getCellValue(FIRST_ROW,STATUS_COL_IDX)).toBe('Open');
      do {
        edit.saveButton.click();
      } while (!confirmPage.confirmButton.isClickable());
      var countAfter = edit.requirementTableRows().length;
      expect(countAfter).toEqual(countBefore + 1);
    });
  });
});

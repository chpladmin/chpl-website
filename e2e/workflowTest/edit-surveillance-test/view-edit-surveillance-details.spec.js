import UploadSurveillanceComponent from '../../components/upload/upload-surveillance/upload-surveillance.po';
import ConfirmPage from '../../pages/surveillance/confirm/confirm.po';
import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';
import SurveillanceEditComponent from '../../components/surveillance/edit/surveillanc-edit.po';
import { assert } from 'chai';

let confirmPage, edit, hooks, loginComponent, upload;
const listingId = '15.04.04.2988.Heal.PC.01.1.181101';
const requirement = '170.315 (a)(13): Patient-Specific Education Resources';
const error = 'At least one Requirement must be surveilled';

beforeEach(async () => {
  loginComponent = new LoginComponent();
  confirmPage = new ConfirmPage();
  upload = new UploadSurveillanceComponent();
  hooks = new Hooks();
  edit = new SurveillanceEditComponent();
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
  while (edit.cancel.isClickable()) {
    edit.cancel.scrollAndClick();
    confirmPage.yesConfirmation.click();
  }
  loginComponent.logOut();
});

describe('when inspecting uploaded surveillance activity, ACB user', () => {

  it('should be able to view surveillance activity details', () => {
    assert.equal(edit.inspectTitle.getText(), 'Inspect Surveillance Activity');
    assert.include(edit.surveillanceDetails.getText(), listingId);
    assert.equal(edit.requirementName(1).getText(),requirement);
  });

  it('should be able to edit surveillance activity details', () => {
    edit.editSurveillance();
    let surveillanceDetails = {
      startDate: '10/10/2019',
      startDateInDetails: 'Oct 10, 2019',
      endDate: '12/31/2020',
      endDateInDetails: 'Dec 31, 2020',
      type: 'Randomized',
      site: '2' ,
    };
    edit.startDate.setValue(surveillanceDetails.startDate);
    edit.endDate.setValue(surveillanceDetails.endDate);
    edit.surveillanceType.selectByVisibleText(surveillanceDetails.type);
    edit.siteSurveilled.setValue(surveillanceDetails.site);
    edit.saveButton.click();
    assert.include(edit.surveillanceDetails.getText(), surveillanceDetails.startDateInDetails);
    assert.include(edit.surveillanceDetails.getText(), surveillanceDetails.endDateInDetails);
    assert.include(edit.surveillanceDetails.getText(), surveillanceDetails.type);
    assert.include(edit.surveillanceDetails.getText(), surveillanceDetails.site);
  });

});

describe('when inspecting uploaded surveillance activity, ACB user', () => {
  it('should not be allowed to remove all requirements', () => {
    edit.editSurveillance();
    edit.removeButton.scrollAndClick();
    edit.saveButton.click();
    assert.include(edit.errorMessages.getText(),error);
  });
});

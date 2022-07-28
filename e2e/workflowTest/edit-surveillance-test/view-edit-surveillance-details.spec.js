import UploadSurveillanceComponent from '../../components/upload/upload-surveillance/upload-surveillance.po';
import ConfirmPage from '../../pages/surveillance/confirm/confirm.po';
import LoginComponent from '../../components/login/login.sync.po';
import Hooks from '../../utilities/hooks';
import SurveillanceEditComponent from '../../components/surveillance/edit/surveillance-edit.po';
import ToastComponent from '../../components/toast/toast.po';

let confirmPage, edit, hooks, loginComponent, toast, upload;
const listingId = '15.04.04.2988.Heal.PC.01.1.181101';
const requirement = '170.315 (g)(4): Quality Management System';
const error = 'At least one Requirement must be surveilled';

beforeEach(async () => {
  loginComponent = new LoginComponent();
  confirmPage = new ConfirmPage();
  upload = new UploadSurveillanceComponent();
  hooks = new Hooks();
  edit = new SurveillanceEditComponent();
  toast = new ToastComponent();
  hooks.open('#/surveillance/upload');
  loginComponent.logIn('drummond');
  upload.uploadSurveillance('../../../resources/surveillance/SAQA1.csv');
  browser.waitUntil( () => toast.toastTitle.isDisplayed());
  toast.clearAllToast();
  hooks.open('#/surveillance/confirm');
  hooks.waitForSpinnerToDisappear();
  browser.waitUntil( () => confirmPage.table.isDisplayed());
  confirmPage.inspectButton(listingId);
  hooks.waitForSpinnerToDisappear();
});

afterEach(() =>{
  while (edit.cancel.isClickable()) {
    edit.cancel.click();
    confirmPage.yesConfirmation.click();
  }
  loginComponent.logOut();
});

describe('when inspecting uploaded surveillance activity, ACB user', () => {

  it('should be able to view surveillance activity details', () => {
    expect(edit.inspectTitle.getText()).toBe('Inspect Surveillance Activity');
    expect(edit.surveillanceDetails.getText()).toContain(listingId);
    expect(edit.requirementName(1).getText()).toBe(requirement);
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
    expect(edit.surveillanceDetails.getText()).toContain(surveillanceDetails.startDateInDetails);
    expect(edit.surveillanceDetails.getText()).toContain(surveillanceDetails.endDateInDetails);
    expect(edit.surveillanceDetails.getText()).toContain(surveillanceDetails.type);
    expect(edit.surveillanceDetails.getText()).toContain(surveillanceDetails.site);
  });

});

describe('when inspecting uploaded surveillance activity, ACB user', () => {
  it('should not be allowed to remove all requirements', () => {
    edit.editSurveillance();
    edit.removeButton.click();
    edit.saveButton.click();
    expect(edit.errorMessages.getText()).toContain(error);
  });
});

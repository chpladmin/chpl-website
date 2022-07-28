import UploadSurveillanceComponent from '../../components/upload/upload-surveillance/upload-surveillance.po';
import ConfirmPage from '../../pages/surveillance/confirm/confirm.po';
import LoginComponent from '../../components/login/login.sync.po';
import Hooks from '../../utilities/hooks';
import SurveillanceEditComponent from '../../components/surveillance/edit/surveillance-edit.po';
import ToastComponent from '../../components/toast/toast.po';

let confirmPage; let edit; let hooks; let loginComponent; let toast; let
  upload;
const listingId = '15.04.04.2988.Heal.PC.01.1.181101';
const error = 'At least one Non-Conformity must be documented';

beforeEach(async () => {
  loginComponent = new LoginComponent();
  edit = new SurveillanceEditComponent();
  confirmPage = new ConfirmPage();
  upload = new UploadSurveillanceComponent();
  hooks = new Hooks();
  toast = new ToastComponent();
  hooks.open('#/surveillance/upload');
  loginComponent.logIn('drummond');
  upload.uploadSurveillance('../../../resources/surveillance/SAQA1.csv');
  browser.waitUntil(() => toast.toastTitle.isDisplayed());
  toast.clearAllToast();
  hooks.open('#/surveillance/confirm');
  hooks.waitForSpinnerToDisappear();
});

describe('when inspecting uploaded surveillance activity, ACB user', () => {
  it('should not allow to remove non-conformity from a requirement with non-conformity', () => {
    browser.waitUntil(() => confirmPage.table.isDisplayed());
    confirmPage.inspectButton(listingId);
    hooks.waitForSpinnerToDisappear();
    edit.editSurveillance();
    hooks.waitForSpinnerToDisappear();
    edit.editRequirement.click();
    edit.removeNonConformity.click();
    edit.saveButton.click();
    expect(edit.errorMessages.getText()).toContain(error);
  });
});

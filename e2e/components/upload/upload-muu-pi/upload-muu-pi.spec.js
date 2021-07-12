import UploadMuuPiComponent from './upload-muu-pi.po';
import LoginComponent from '../../login/login.po';
import Hooks from '../../../utilities/hooks';
import ToastComponent from '../../toast/toast.po';

let hooks;
let loginComponent;
let toast;
let uploadMuuPiComponent;
let flagState;

beforeEach(async () => {
  uploadMuuPiComponent = new UploadMuuPiComponent();
  loginComponent = new LoginComponent();
  toast = new ToastComponent();
  hooks = new Hooks();
  flagState = hooks.getFlagState('promoting-interoperability');
  await hooks.open('#/administration/upload');
});

describe('As a ROLE_ONC user', () => {
  beforeEach(() => {
    loginComponent.logIn('onc');
  });

  afterEach(() => {
    hooks.waitForSpinnerToDisappear();
    toast.clearAllToast();
    loginComponent.logOut();
  });

  it('should be able to upload valid format of Muu or Pi file based on flag state', () => {
    if (flagState) {
      uploadMuuPiComponent.accurateAsOfDate.setValue('01/01/2021');
      uploadMuuPiComponent.uploadPi('../../../resources/pi/PI_upload.csv');
      browser.waitUntil(() => toast.toastTitle.isDisplayed());
      expect(toast.toastTitle.getText()).toBe('Success');
    } else {
      uploadMuuPiComponent.accurateAsOfDate.setValue('01/01/2021');
      uploadMuuPiComponent.uploadMuu('../../../resources/muu/MUU_upload.csv');
      browser.waitUntil(() => toast.toastTitle.isDisplayed());
      expect(toast.toastTitle.getText()).toBe('Success');
    }
  });

  it('shount not be able to upload invalid format of Muu or Pi file', () => {
    if (flagState) {
      uploadMuuPiComponent.accurateAsOfDate.setValue('01/01/2021');
      uploadMuuPiComponent.uploadPi('../../../resources/apiDoc/APIDoc_File.xlsx');
      browser.waitUntil(() => toast.toastTitle.isDisplayed());
      expect(toast.toastTitle.getText()).toBe('Error');
    } else {
      uploadMuuPiComponent.accurateAsOfDate.setValue('01/01/2021');
      uploadMuuPiComponent.uploadMuu('../../../resources/apiDoc/APIDoc_File.xlsx');
      browser.waitUntil(() => toast.toastTitle.isDisplayed());
      expect(toast.toastTitle.getText()).toBe('Error');
    }
  });
});

import UploadMuuComponent from './upload-muu.po';
import LoginComponent from '../../login/login.po';
import Hooks from '../../../utilities/hooks';
import ToastComponent from '../../toast/toast.po';

let hooks, loginComponent, toast, uploadMuuComponent;

beforeEach(async () => {
  uploadMuuComponent = new UploadMuuComponent();
  loginComponent = new LoginComponent();
  toast = new ToastComponent();
  hooks = new Hooks();
  await hooks.open('#/administration/upload');
});

describe('When uploading Muu file as an admin', () => {
  beforeEach(function () {
    loginComponent.logIn('admin');
  });

  afterEach(function () {
    hooks.waitForSpinnerToDisappear();
    toast.clearAllToast();
    loginComponent.logOut();
  });

  it('can upload valid format of Muu file', () => {
    uploadMuuComponent.uploadMuu('../../../resources/muu/MUU_upload.csv');
    browser.waitUntil( () => toast.toastTitle.isDisplayed());
    expect(toast.toastTitle.getText()).toBe('Success');
  });

  it('cant upload invalid format of Muu file', () => {
    uploadMuuComponent.uploadMuu('../../../resources/apiDoc/APIDoc_File.xlsx');
    browser.waitUntil( () => toast.toastTitle.isDisplayed());
    expect(toast.toastTitle.getText()).toBe('Error');
  });
});

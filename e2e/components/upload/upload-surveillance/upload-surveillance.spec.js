import UploadSurveillanceComponent from './upload-surveillance.po';
import LoginComponent from '../../login/login.po';
import Hooks from '../../../utilities/hooks';
import ToastComponent from '../../toast/toast.po';

let hooks, loginComponent, toast, uploadSurveillanceComponent;

beforeEach(async () => {
  uploadSurveillanceComponent = new UploadSurveillanceComponent();
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  toast = new ToastComponent();
  await hooks.open('#/surveillance/upload');
});

describe('when uploading a surveillance activity as ONC-ACB', () => {
  beforeEach(function () {
    loginComponent.logIn('drummond');
  });

  afterEach(function () {
    hooks.waitForSpinnerToDisappear();
    toast.clearAllToast();
    loginComponent.logOut();
  });

  it('can upload valid file format of surveillance activity file', () => {
    uploadSurveillanceComponent.uploadSurveillance('../../../resources/surveillance/SAQA1.csv');
    browser.waitUntil( () => toast.toastTitle.isDisplayed());
    expect(toast.toastTitle.getText()).toBe('Success');
  });

  it('can\'t upload invalid file format of surveillance activity file', () => {
    uploadSurveillanceComponent.uploadSurveillance('../../../resources/surveillance/SurveillanceInvalid.csv');
    browser.waitUntil( () => toast.toastTitle.isDisplayed());
    expect(toast.toastTitle.getText()).toBe('Error');
  });
});

import LoginComponent from '../../login/login.sync.po';
import Hooks from '../../../utilities/hooks';
import ToastComponent from '../../toast/toast.po';

import UploadPiComponent from './upload-pi.po';

let hooks;
let loginComponent;
let toast;
let upload;

beforeEach(async () => {
  upload = new UploadPiComponent();
  loginComponent = new LoginComponent();
  toast = new ToastComponent();
  hooks = new Hooks();
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

  it('should be able to upload valid format of Promoting Interoperability file', () => {
    upload.upload('../../../resources/pi/PI_upload.csv', '01/01/2021');
    browser.waitUntil(() => toast.toastTitle.isDisplayed());
    expect(toast.toastTitle.getText()).toBe('Success');
  });

  it('should not be able to upload invalid format of Promoting Interoperability file', () => {
    upload.upload('../../../resources/apiDoc/APIDoc_File.xlsx', '01/01/2021');
    browser.waitUntil(() => toast.toastTitle.isDisplayed());
    expect(toast.toastTitle.getText()).toBe('Error');
  });
});

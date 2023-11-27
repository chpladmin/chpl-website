import LoginComponent from '../../login/login.sync.po';
import Hooks from '../../../utilities/hooks';

import UploadPiComponent from './upload-pi.po';

let hooks;
let loginComponent;
let upload;

beforeEach(async () => {
  upload = new UploadPiComponent();
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  await hooks.open('#/administration/upload');
});

describe('As a ROLE_ONC user', () => {
  beforeEach(() => {
    loginComponent.logIn('onc');
  });

  afterEach(() => {
    browser.reloadSession();
  });

  it('should be able to upload valid format of Promoting Interoperability file', () => {
    upload.upload('../../../resources/pi/PI_upload.csv', '01/01/2021');
    hooks.waitForSpinnerToDisappear();
    expect(upload.uploadResults).toHaveTextContaining('The file will be processed and an email will be sent to chpl-onc@ainq.com when processing is complete');
  });

  it('should not be able to upload invalid format of Promoting Interoperability file', () => {
    upload.upload('../../../resources/apiDoc/APIDoc_File.xlsx', '01/01/2021');
    hooks.waitForSpinnerToDisappear();
    expect(upload.uploadResults).toHaveTextContaining('was not uploaded successfully. File must be a CSV document.');
  });
});

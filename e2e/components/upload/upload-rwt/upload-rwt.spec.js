import LoginComponent from '../../login/login.sync.po';
import Hooks from '../../../utilities/hooks';

import UploadRwtComponent from './upload-rwt.po';

let hooks;
let loginComponent;
let upload;

beforeEach(async () => {
  upload = new UploadRwtComponent();
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  await hooks.open('#/administration/upload');
});

describe('When uploading rwt file as ONC-ACB', () => {
  beforeEach(() => {
    loginComponent.logIn('acb');
  });

  afterEach(() => {
    browser.reloadSession();
  });

  it('can upload valid format of rwt file', () => {
    upload.uploadRwt('../../../resources/rwt/RWT_Upload_File.csv');
    hooks.waitForSpinnerToDisappear();
    expect(upload.uploadResults.getText()).toContain('was uploaded successfully. The file will be processed and an email will be sent to');
  });

  it('can\'t upload invalid format of rwt file', () => {
    upload.uploadRwt('../../../resources/apiDoc/APIDoc_File.xlsx');
    hooks.waitForSpinnerToDisappear();
    expect(upload.uploadResults.getText()).toContain('was not uploaded successfully.');
  });
});

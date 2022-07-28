import LoginComponent from '../../login/login.sync.po';
import Hooks from '../../../utilities/hooks';

import UploadRwtComponent from './upload-rwt.po';

let hooks;
let loginComponent;
let uploadRwtComponent;

beforeEach(async () => {
  uploadRwtComponent = new UploadRwtComponent();
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  await hooks.open('#/administration/upload');
});

describe('When uploading rwt file as ONC-ACB', () => {
  beforeEach(() => {
    loginComponent.logIn('acb');
  });

  afterEach(() => {
    loginComponent.logOut();
  });

  it('can upload valid format of rwt file', () => {
    uploadRwtComponent.uploadRwt('../../../resources/rwt/RWT_Upload_File.csv');
    browser.waitUntil(() => !uploadRwtComponent.uploadButton.isDisplayed());
    expect(uploadRwtComponent.fileUploadText.getText()).toContain('was uploaded successfully. The file will be processed and an email will be sent to');
  });

  it('cant upload invalid format of rwt file', () => {
    uploadRwtComponent.uploadRwt('../../../resources/apiDoc/APIDoc_File.xlsx');
    browser.waitUntil(() => !uploadRwtComponent.uploadButton.isDisplayed());
    expect(uploadRwtComponent.fileUploadText.getText()).toContain('was not uploaded successfully.');
  });
});

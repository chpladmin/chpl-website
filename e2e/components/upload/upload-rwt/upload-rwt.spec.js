import UploadRwtComponent from './upload-rwt.po';
import LoginComponent from '../../login/login.po';
import Hooks from '../../../utilities/hooks';

let hooks, loginComponent, uploadRwtComponent;

beforeEach(async () => {
  uploadRwtComponent = new UploadRwtComponent();
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  await hooks.open('#/administration/upload');
});

describe('When uploading rwt file as ONC-ACB', () => {
  beforeEach(function () {
    loginComponent.logIn('acb');
  });

  afterEach(function () {
    loginComponent.logOut();
  });

  it('can upload valid format of rwt file', () => {
    uploadRwtComponent.uploadRwt('../../../resources/rwt/RWT_Upload_File.csv');
    browser.waitUntil( () => !uploadRwtComponent.uploadButton.isDisplayed());
    assert.include(uploadRwtComponent.fileUploadText.getText(),'was uploaded successfully. The file will be processed and an email will be sent to', 'File has uploaded successfully');
  });

  it('cant upload invalid format of rwt file', () => {
    uploadRwtComponent.uploadRwt('../../../resources/apiDoc/APIDoc_File.xlsx');
    browser.waitUntil( () => !uploadRwtComponent.uploadButton.isDisplayed());
    assert.include(uploadRwtComponent.fileUploadText.getText(),'was not uploaded successfully.');
  });
});

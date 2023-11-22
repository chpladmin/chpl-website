import LoginComponent from '../../login/login.sync.po';
import Hooks from '../../../utilities/hooks';

import UploadApiDocumentationComponent from './upload-api-documentation.po';

let hooks;
let loginComponent;
let upload;

beforeAll(async () => {
  upload = new UploadApiDocumentationComponent();
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  await hooks.open('#/administration/upload');
});

describe('When uploading API documentation files as ADMIN', () => {
  beforeEach(() => {
    loginComponent.logIn('admin');
  });

  it('can be uploaded successfully back to back', () => {
    upload.uploadAPIDocFile('../../../resources/apiDoc/APIDoc_File.xlsx');
    expect(upload.uploadResults.getText()).toContain('was uploaded successfully.');
    upload.clearResults();
    upload.uploadAPIDocFile('../../../resources/apiDoc/APIDoc_File.xlsx');
    expect(upload.uploadResults.getText()).not.toContain('was not uploaded successfully.');
  });
});

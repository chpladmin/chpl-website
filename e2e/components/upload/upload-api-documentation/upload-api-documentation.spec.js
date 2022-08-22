import LoginComponent from '../../login/login.sync.po';
import Hooks from '../../../utilities/hooks';

import UploadApiDocumentationComponent from './upload-api-documentation.po';

let hooks;
let loginComponent;
let uploadcomponent;

beforeAll(async () => {
  uploadcomponent = new UploadApiDocumentationComponent();
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  await hooks.open('#/administration/upload');
});

describe('When uploading API documentation files as ADMIN', () => {
  beforeAll(() => {
    loginComponent.logIn('admin');
  });

  it('can be uploaded successfully back to back', () => {
    uploadcomponent.uploadAPIDocFile('../../../resources/apiDoc/APIDoc_File.xlsx');
    expect(uploadcomponent.apiDocUploadText.getText()).toContain('was uploaded successfully.');
    uploadcomponent.uploadAPIDocFile('../../../resources/apiDoc/APIDoc_File.xlsx');
    expect(uploadcomponent.apiDocUploadText.getText()).not.toContain('was not uploaded successfully.');
  });
});

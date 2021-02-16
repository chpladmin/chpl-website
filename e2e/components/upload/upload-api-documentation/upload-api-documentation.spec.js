import UploadApiDocumentationComponent from './upload-api-documentation.po';
import LoginComponent from '../../login/login.po';
import Hooks from '../../../utilities/hooks';

let hooks, loginComponent, uploadcomponent;

beforeAll(async () => {
  uploadcomponent = new UploadApiDocumentationComponent();
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  await hooks.open('#/administration/upload');
});

describe('When uploading API documentation files as ADMIN', () => {

  beforeAll(function () {
    loginComponent.logIn('admin');
  });

  it('can be uploaded successfully back to back', () => {
    uploadcomponent.uploadAPIDocFile('../../../resources/apiDoc/APIDoc_File.xlsx');
    assert.include(uploadcomponent.apiDocUploadText.getText(),'was uploaded successfully.');
    uploadcomponent.uploadAPIDocFile('../../../resources/apiDoc/APIDoc_File.xlsx');
    assert.notInclude(uploadcomponent.apiDocUploadText.getText(),'was not uploaded successfully.');
  });

});

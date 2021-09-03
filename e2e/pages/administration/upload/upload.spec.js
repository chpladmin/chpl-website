import UploadListingComponent from '../../../components/upload/upload-listing/upload-listing.po';
import UploadAPIDocumentationComponent from '../../../components/upload/upload-api-documentation/upload-api-documentation.po';
import LoginComponent from '../../../components/login/login.po';
import Hooks from '../../../utilities/hooks';

let hooks, loginComponent, uploadAPIDocumentationComponent, uploadListingComponent;

beforeAll(async () => {
  uploadListingComponent = new UploadListingComponent();
  uploadAPIDocumentationComponent = new UploadAPIDocumentationComponent();
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  await hooks.open('#/administration/upload');
});

describe('Upload Page', () => {
  beforeAll(function () {
    loginComponent.logIn('admin');
  });

  it('has correct title for upload listing component', () => {
    expect(uploadListingComponent.title.getText()).toContain('Upload Certified Products');
  });

  it('has correct title for upload api documentation component', () => {
    expect(uploadAPIDocumentationComponent.title.getText()).toContain('Upload API Documentation Information');
  });

});

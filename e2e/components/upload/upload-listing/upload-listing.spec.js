import UploadListingComponent from './upload-listing.po';
import LoginComponent from '../../login/login.po';
import Hooks from '../../../utilities/hooks';

let hooks, loginComponent, uploadListingComponent;

beforeEach(async () => {
  uploadListingComponent = new UploadListingComponent();
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  await hooks.open('#/administration/upload');
});

describe('When uploading a listing as ONC-ACB', () => {
  beforeEach(function () {
    loginComponent.logIn('acb');
  });

  afterEach(function () {
    loginComponent.logOut();
  });

  it('can\'t upload a file which doesn\'t match current template', () => {
    uploadListingComponent.uploadListing('../../../resources/upload-listing-beta/2015_WithCriteria.csv');
    assert.include(uploadListingComponent.listingUploadText.getText(),'was not uploaded successfully');
  });

  it('can upload v19 template', () => {
    uploadListingComponent.uploadListing('../../../resources/listings/2015_v19_AQA1.csv');
    assert.include(uploadListingComponent.listingUploadText.getText(),'was uploaded successfully. 1 pending products are ready for confirmation.', 'File has uploaded successfully');
  });

  it('can upload v20 template', () => {
    uploadListingComponent.uploadListing('../../../resources/listings/2015_v20_AQA5.csv');
    assert.include(uploadListingComponent.listingUploadText.getText(),'was uploaded successfully. 1 pending products are ready for confirmation.', 'File has uploaded successfully');
  });
});

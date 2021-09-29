import UploadListingComponent from './upload-listing.po';
import LoginComponent from '../../login/login.po';
import Hooks from '../../../utilities/hooks';

let hooks;
let loginComponent;
let uploadListingComponent;

beforeEach(async () => {
  uploadListingComponent = new UploadListingComponent();
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  await hooks.open('#/administration/upload');
});

describe('When uploading a listing as ONC-ACB', () => {
  beforeEach(() => {
    loginComponent.logIn('acb');
  });

  afterEach(() => {
    loginComponent.logOut();
  });

  it('can\'t upload a file which doesn\'t match current template', () => {
    uploadListingComponent.uploadListing('../../../resources/upload-listing-beta/2015_WithCriteria.csv');
    expect(uploadListingComponent.listingUploadText.getText()).toContain('was not uploaded successfully');
  });

  it('can upload v19 template', () => {
    uploadListingComponent.uploadListing('../../../resources/listings/2015_v19_AQA1.csv');
    expect(uploadListingComponent.listingUploadText.getText()).toContain('was uploaded successfully. 1 pending products are ready for confirmation.');
  });

  it('can upload v20 template', () => {
    uploadListingComponent.uploadListing('../../../resources/listings/2015_v20_AQA5.csv');
    expect(uploadListingComponent.listingUploadText.getText()).toContain('was uploaded successfully. 1 pending products are ready for confirmation.');
  });
});

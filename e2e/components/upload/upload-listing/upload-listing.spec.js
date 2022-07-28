import LoginComponent from '../../login/login.sync.po';
import Hooks from '../../../utilities/hooks';

import UploadListingComponent from './upload-listing.po';

let hooks;
let loginComponent;
let upload;

beforeEach(async () => {
  upload = new UploadListingComponent();
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
    upload.uploadListing('../../../resources/upload-listing-beta/2015_WithCriteria.csv', true);
    browser.saveScreenshot(`test_reports/e2e/screenshot/${Date.now()}.png`);
    expect(upload.uploadMessage('2015_WithCriteria.csv')).toHaveTextContaining('was not uploaded successfully');
  });

  it('can upload v19 template', () => {
    upload.uploadListing('../../../resources/listings/2015_v19_AQA1.csv', true);
    browser.saveScreenshot(`test_reports/e2e/screenshot/${Date.now()}.png`);
    expect(upload.uploadMessage('2015_v19_AQA1.csv')).toHaveTextContaining('was uploaded successfully. 1 pending product is ready for confirmation.');
  });

  it('can upload v20 template', () => {
    upload.uploadListing('../../../resources/listings/2015_v20_AQA5.csv', true);
    browser.saveScreenshot(`test_reports/e2e/screenshot/${Date.now()}.png`);
    expect(upload.uploadMessage('2015_v20_AQA5.csv')).toHaveTextContaining('was uploaded successfully. 1 pending product is ready for confirmation.');
  });
});

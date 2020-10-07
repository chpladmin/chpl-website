import UploadListingComponent from './upload-listing.po';
import LoginComponent from '../../login/login.po';
import Hooks from '../../../utilities/hooks';

let hooks, loginComponent, uploadListingComponent;

beforeAll(async () => {
    uploadListingComponent = new UploadListingComponent();
    loginComponent = new LoginComponent();
    hooks = new Hooks();
    await hooks.open('#/administration/upload');
});

describe('When uploading a listing as ONC-ACB', () => {
    beforeAll(function () {
        loginComponent.logIn('acb');
    });

    it('can upload v19 template', () => {
        uploadListingComponent.uploadListing('../../../resources/2015_v19_AQA1.csv');
        assert.include(uploadListingComponent.listingUploadText.getText(),'was uploaded successfully. 1 pending products are ready for confirmation.', 'File has uploaded successfully');
    });

    it('can upload v18 template', () => {
        uploadListingComponent.uploadListing('../../../resources/2015_v18_AQA2.csv');
        assert.include(uploadListingComponent.listingUploadText.getText(),'was uploaded successfully. 1 pending products are ready for confirmation.', 'File has uploaded successfully');
    });
});

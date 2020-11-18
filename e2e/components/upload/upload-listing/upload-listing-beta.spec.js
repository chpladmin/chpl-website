import UploadListingComponent from './upload-listing.po';
import LoginComponent from '../../login/login.po';
import Hooks from '../../../utilities/hooks';

let hooks, loginComponent, uploadListingComponent;

const inputs = require('./upload-listing-beta-dp');

beforeAll(async () => {
    uploadListingComponent = new UploadListingComponent();
    loginComponent = new LoginComponent();
    hooks = new Hooks();
    await hooks.open('#/administration/upload');
});

describe('When uploading a listing as ONC-ACB', () => {
    beforeAll(function () {
        loginComponent.logInWithEmail('acb');
    });

    inputs.forEach(input => {
        let testName = input.testName;
        let path= input.path;
        let message= input.message;

            it(`can upload file - ${testName}`, () => {
                uploadListingComponent.uploadListingBeta(path);
                //assert.include(uploadListingComponent.listingUploadText.getText(),message, 'File has uploaded successfully');
            });
        });
});

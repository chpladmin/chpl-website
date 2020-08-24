import UploadPage from './upload.po';
import LoginComponent from '../../../components/login/login.po';
import Hooks from '../../../utilities/hooks';

let hooks, loginComponent, uploadPage;

beforeAll(async () => {
    uploadPage = new UploadPage();
    loginComponent = new LoginComponent();
    hooks = new Hooks();
    await hooks.open('#/administration/upload');
});

describe('When uploading a listing as ONC-ACB', () => {
    beforeAll(function () {
        loginComponent.loginAsACB();
    })

    it('can upload v19 template', () => {
        uploadPage.uploadListing('../../../resources/2015_v19_AQA1.csv');
        assert.include(uploadPage.listingUploadText.getText(),'was uploaded successfully. 1 pending products are ready for confirmation.', 'File has uploaded successfully');
    })

    it('can upload v18 template', () => {
        uploadPage.uploadListing('../../../resources/2015_v18_AQA2.csv');
        assert.include(uploadPage.listingUploadText.getText(),'was uploaded successfully. 1 pending products are ready for confirmation.', 'File has uploaded successfully');
    })

    afterAll(function () {
        if (!loginComponent.logoutButton.isDisplayed()) {
            loginComponent.openLoginComponent();
        }
        loginComponent.logOut();
    })
})

describe('When uploading API documentation files as ADMIN', () => {

    beforeAll(function () {
        loginComponent.loginAsAdmin();
    })

    it('can be uploaded successfully back to back', () => {
        uploadPage.uploadAPIDocFile('../../../resources/APIDoc_File.xlsx');
        assert.include(uploadPage.apiDocUploadText.getText(),'was uploaded successfully.');
        uploadPage.uploadAPIDocFile('../../../resources/APIDoc_File.xlsx');
        assert.notInclude(uploadPage.apiDocUploadText.getText(),'was not uploaded successfully.');
    })

})


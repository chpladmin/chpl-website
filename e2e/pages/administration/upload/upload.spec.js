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
        loginComponent.loginAsAdmin();
    })

    it('has correct title for upload listing component', () => {
        assert.include(uploadListingComponent.title.getText(),'Upload Certified Products');
    })

    it('has correct title for upload api documentation component', () => {
        assert.include(uploadAPIDocumentationComponent.title.getText(),'Upload API Documentation Information');
    })

})

import UploadPage from './upload.po';
import LoginComponent from '../../../components/login/login.po';
import Hooks from '../../../utilities/hooks';

let hooks, loginComponent, uploadPage;

beforeEach(async () => {
    uploadPage = new UploadPage();
    loginComponent = new LoginComponent();
    hooks = new Hooks();
    await hooks.open('#/administration/upload');
});

describe('Upload page', () => {

    it('allows uploading v19 template', () => {
        loginComponent.loginAsACB();
        uploadPage.uploadListing('../../../resources/2015_v19_AQA1.csv');
        assert.include(uploadPage.uploadSuccessfulText.getText(),'was uploaded successfully. 1 pending products are ready for confirmation.', 'File has uploaded successfully');
    })

    it('allows uploading v18 template', () => {
        uploadPage.uploadListing('../../../resources/2015_v18_AQA2.csv');
        assert.include(uploadPage.uploadSuccessfulText.getText(),'was uploaded successfully. 1 pending products are ready for confirmation.', 'File has uploaded successfully');
    })

})

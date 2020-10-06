import UploadRwtComponent from './upload-rwt.po';
import LoginComponent from '../../login/login.po';
import Hooks from '../../../utilities/hooks';

let hooks, loginComponent, uploadRwtComponent;

beforeAll(async () => {
    uploadRwtComponent = new UploadRwtComponent();
    loginComponent = new LoginComponent();
    hooks = new Hooks();
    await hooks.open('#/administration/upload');
});

describe('When uploading rwt file as ONC-ACB', () => {
    beforeAll(function () {
        loginComponent.logIn('acb');
    });

    it('can upload valid format of rwt file', () => {
        uploadRwtComponent.uploadRwt('../../../resources/RWT_Upload_File.xlsx');
        assert.include(uploadRwtComponent.fileUploadText.getText(),'was uploaded successfully. 1 pending products are ready for confirmation.', 'File has uploaded successfully');
    });

    it('cant upload invalid format of rwt file', () => {
        uploadRwtComponent.uploadRwt('../../../resources/2015_v18_AQA2.csv');
        assert.include(uploadRwtComponent.fileUploadText.getText(),'');
    });
});

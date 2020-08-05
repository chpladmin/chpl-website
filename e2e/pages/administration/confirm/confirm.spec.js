import ConfirmPage from './confirm.po';
import UploadPage from '../upload/upload.po';
import LoginComponent from '../../../components/login/login.po';
import Hooks from '../../../utilities/hooks';

let confirmPage, hooks, loginComponent, uploadPage;

beforeEach(() => {
    uploadPage = new UploadPage();
    confirmPage = new ConfirmPage();
    loginComponent = new LoginComponent();
    hooks = new Hooks();
    hooks.open('/administration/upload');
    loginComponent.loginAsACB();
    uploadPage.uploadListing('../../../resources/2015_v19_AQA1.csv');
});

describe('Confirm page', () => {

    it('allows user to reject a file', () => {
        hooks.open('/administration/confirm/listings');
        confirmPage.rejectListing('15.04.04.1722.AQA1.03.01.1.200620');
        assert.equal(confirmPage.findListingtoReject('15.04.04.1722.AQA1.03.01.1.200620').isDisplayed(),false)
    });

});

import UploadPage from '../../pages/administration/upload/upload.po';
import ConfirmPage from '../../pages/administration/confirm/confirm.po';
import ListingEditPage from '../../pages/searchCHPL/listingEdit/listingEdit.po';
import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';
import {assert} from 'chai';

let confirmPage , hooks, listingEditPage, loginComponent, uploadPage;

// **Run once before the first test case**
beforeAll(() => {
    uploadPage = new UploadPage();
    confirmPage = new ConfirmPage();
    listingEditPage = new ListingEditPage();
    loginComponent = new LoginComponent();
    hooks = new Hooks();
    hooks.open('/administration/upload');
    loginComponent.loginAsACB();
    uploadPage.uploadListing('../../../utilities/2015_v19_AQA1.csv');
})

describe('an ACB user', () => {
    // **Run once before each test case**
    beforeEach(function () {
        hooks.open('/administration/confirm/listings')
    })

    it('should be able to add test procedure, test data, test tools, test functionality to uploaded listing (170.315 (b)(3) cures criteria)', () => {
        confirmPage.gotoConfirmListingPage('15.04.04.1722.AQA1.03.01.1.200620');
        listingEditPage.gotoEditCriteria('170.315 (b)(3)' , true);
        listingEditPage.selectTestFunctionality('(b)(3)(ii)(B)(4)');
        listingEditPage.selectTestProcedures('ONC Test Method - Surescripts (Alternative)' , '1');
        listingEditPage.selectTestData('ONC Test Method' , '2');
        listingEditPage.selectTestTools('Inferno' , '3');
        listingEditPage.saveCertifiedProduct.waitAndClick();
        listingEditPage.viewDetailsCriteria('170.315 (b)(3)' ,true);
        assert.include(listingEditPage.getTestFunctionalityDetail('170.315 (b)(3)' ,true).getText(), 'Request to send an additional supply of medication (Resupply)');
        assert.include(listingEditPage.getTestProcedureDetail('170.315 (b)(3)' ,true).getText(), 'ONC Test Method - Surescripts (Alternative)');
        assert.include(listingEditPage.getTestDataDetail('170.315 (b)(3)' ,true).getText(), 'ONC Test Method');
        assert.include(listingEditPage.getTestToolDetail('170.315 (b)(3)' ,true).getText(), 'Inferno');
        listingEditPage.closeEditListing();
    })

    it('should be able to remove uploaded test procedure, test data, test tools (170.315 (b)(3) cures criteria)', () => {
        browser.refresh();
        confirmPage.gotoConfirmListingPage('15.04.04.1722.AQA1.03.01.1.200620');
        listingEditPage.gotoEditCriteria('170.315 (b)(3)' , true);
        //Remove test tool
        listingEditPage.removeTestProcToolData('Remove item HL7v2 Immunization Test Suite');
        //Remove test data
        listingEditPage.removeTestProcToolData('Remove item ONC Test Method');
        // //Remove test procedure
        listingEditPage.removeTestProcToolData('Remove item ONC Test Method');
        listingEditPage.saveCertifiedProduct.waitAndClick();
        listingEditPage.viewDetailsCriteria('170.315 (b)(3)' , true);
        assert.notInclude(listingEditPage.getTestFunctionalityDetail('170.315 (b)(3)' ,true).getText(), 'Request to send an additional supply of medication (Resupply)');
        assert.notInclude(listingEditPage.getTestProcedureDetail('170.315 (b)(3)' ,true).getText(), 'ONC Test Method');
        assert.notInclude(listingEditPage.getTestDataDetail('170.315 (b)(3)' ,true).getText(), 'ONC Test Method');
        assert.notInclude(listingEditPage.getTestToolDetail('170.315 (b)(3)' ,true).getText(), 'HL7v2 Immunization Test Suite');
        listingEditPage.closeEditListing();
    })
})

import UploadPage from '../../pages/administration/upload/upload.po';
import ConfirmPage from '../../pages/administration/confirm/confirm.po';
import ListingEditPage from '../../pages/searchCHPL/listingEdit/listingEdit.po';
import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';
import {assert} from 'chai';

let confirmPage , hooks, listingEditPage, loginComponent, uploadPage;

describe('Admin can', () => {
    // **Run once before the first test case**
    before(() => {
        uploadPage = new UploadPage();
        confirmPage = new ConfirmPage();
        listingEditPage = new ListingEditPage();
        loginComponent = new LoginComponent();
        hooks = new Hooks();
        hooks.open('/administration/upload');
        loginComponent.loginAsAdmin();
        uploadPage.uploadListing('../../../utilities/2015_v18_AQA2.csv');
        assert.include(uploadPage.uploadSuccessfulText.getText(),uploadPage.expectedUploadSuccessfulText, 'File has uploaded successfully');
    })
    // **Run once before each test case**
    beforeEach(function () {
        hooks.open('/administration/confirm/listings')
    })

    it('add test procedure, test data, test tools, test functionality to v18 uploaded listing (170.315 (b)(3) cures criteria)', () => {
        confirmPage.gotoConfirmListingPg('15.04.04.1722.AQA2.03.00.1.190615','170.315 (b)(3)');
        listingEditPage.gotoEditCriteria('170.315 (b)(3)' , true);
        listingEditPage.selectTestFunctionality('(b)(3)(ii)(B)(4)')
        listingEditPage.selectTestProcedures('ONC Test Method - Surescripts (Alternative)' , '1');
        listingEditPage.selectTestData('ONC Test Method' , '2');
        listingEditPage.selectTestTools('Inferno' , '3');
        listingEditPage.saveCertifiedProduct.waitAndClick();
        listingEditPage.viewDetailsCriteria('170.315 (b)(3)' , true);
        assert.include($('//*[@id="criteria_170.315 (b)(3)_details_row_Functionality_Tested_cures"]').getText(), 'Request to send an additional supply of medication (Resupply)');
        assert.include($('//*[@id="criteria_170.315 (b)(3)_details_row_Test_procedure_cures"]').getText(), 'ONC Test Method - Surescripts (Alternative)');
        assert.include($('//*[@id="criteria_170.315 (b)(3)_details_row_Test_data_cures"]').getText(), 'ONC Test Method');
        assert.include($('//*[@id="criteria_170.315 (b)(3)_details_row_Test_tool_cures"]').getText(), 'Inferno');
        listingEditPage.closeEditListing();
    })

    it('remove uploaded test procedure, test data, test tools, test functionality (170.315 (b)(3) cures criteria)', () => {
        browser.refresh();
        confirmPage.gotoConfirmListingPg('15.04.04.1722.AQA2.03.00.1.190615','170.315 (b)(3)');
        listingEditPage.gotoEditCriteria('170.315 (b)(3)' , true);
        //Remove test tool
        listingEditPage.removeTestProcToolData('Remove item HL7v2 Immunization Test Suite');
        //Remove test data
        listingEditPage.removeTestProcToolData('Remove item ONC Test Method');
        // //Remove test procedure
        listingEditPage.removeTestProcToolData('Remove item (b)(3)(ii)(B)(5)');
        listingEditPage.saveCertifiedProduct.waitAndClick();
        listingEditPage.viewDetailsCriteria('170.315 (b)(3)' , true);
        assert.notInclude($('//*[@id="criteria_170.315 (b)(3)_details_row_Functionality_Tested_cures"]').getText(), 'Request to send an additional supply of medication (Resupply)');
        assert.notInclude($('//*[@id="criteria_170.315 (b)(3)_details_row_Test_procedure_cures"]').getText(), 'ONC Test Method');
        assert.notInclude($('//*[@id="criteria_170.315 (b)(3)_details_row_Test_data_cures"]').getText(), 'ONC Test Method');
        assert.notInclude($('//*[@id="criteria_170.315 (b)(3)_details_row_Test_tool_cures"]').getText(), 'HL7v2 Immunization Test Suite');
        listingEditPage.closeEditListing();
    })

    after(() => {
        // clean up
        // Need to reject uploaded files for this test
        hooks.open('/administration/confirm/listings');
        confirmPage.rejectListing('15.04.04.1722.AQA2.03.00.1.190615');
    })
})

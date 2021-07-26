// This test is using AQA1 upload listing

import UploadPage from '../../pages/administration/upload/upload.po';
import ConfirmPage from '../../pages/administration/confirm/confirm.po';
import ListingEditComponent from '../../components/listing/edit/listing-edit.po';
import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';

let confirmPage;
let hooks;
let listingEditComponent;
let loginComponent;
let uploadPage;

beforeAll(() => {
  uploadPage = new UploadPage();
  confirmPage = new ConfirmPage();
  listingEditComponent = new ListingEditComponent();
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  hooks.open('#/administration/upload');
  loginComponent.logIn('acb');
});

describe('an ACB user', () => {
  beforeEach(() => {
    hooks.open('#/administration/upload');
    uploadPage.uploadListing('../../../resources/listings/2015_v19_AQA1.csv');
    uploadPage.waitForSuccessfulUpload('AQA1');
    hooks.open('#/administration/confirm/listings');
  });

  it.skip('should be able to add test procedure, test data, test tools, test functionality to uploaded listing (170.315 (b)(3) cures criteria)', () => {
    confirmPage.gotoConfirmListingPage('15.04.04.1722.AQA1.03.01.1.200620');
    listingEditComponent.openEditCriteria('170.315 (b)(3)', true);
    listingEditComponent.addTestFunctionality('(b)(3)(ii)(B)(4)');
    listingEditComponent.addTestProcedures('ONC Test Method - Surescripts (Alternative)', '1');
    listingEditComponent.addTestData('ONC Test Method', '2');
    listingEditComponent.addTestTools('Inferno', '3');
    listingEditComponent.saveCertifiedProduct.waitAndClick();
    listingEditComponent.viewDetailsCriteria('170.315 (b)(3)', true);
    assert.include(listingEditComponent.getTestFunctionalityDetail('170.315 (b)(3)', true).getText(), 'Request to send an additional supply of medication (Resupply)');
    assert.include(listingEditComponent.getTestProcedureDetail('170.315 (b)(3)', true).getText(), 'ONC Test Method - Surescripts (Alternative)');
    assert.include(listingEditComponent.getTestDataDetail('170.315 (b)(3)', true).getText(), 'ONC Test Method');
    assert.include(listingEditComponent.getTestToolDetail('170.315 (b)(3)', true).getText(), 'Inferno');
  });

  it.skip('should be able to remove uploaded test procedure, test tools (170.315 (b)(3) cures criteria)', () => {
    confirmPage.gotoConfirmListingPage('15.04.04.1722.AQA1.03.01.1.200620');
    listingEditComponent.openEditCriteria('170.315 (b)(3)', true);
    // Remove test tool
    listingEditComponent.removeTestProcToolData('Remove item HL7v2 Immunization Test Suite');
    // Remove test procedure
    listingEditComponent.removeTestProcToolData('Remove item ONC Test Method');
    listingEditComponent.saveCertifiedProduct.waitAndClick();
    listingEditComponent.viewDetailsCriteria('170.315 (b)(3)', true);
    assert.notInclude(listingEditComponent.getTestProcedureDetail('170.315 (b)(3)', true).getText(), 'ONC Test Method');
    assert.notInclude(listingEditComponent.getTestToolDetail('170.315 (b)(3)', true).getText(), 'HL7v2 Immunization Test Suite');
  });

  afterEach(() => {
    browser.refresh();
  });
});

import Upload from '../../components/upload/upload-listing/upload-listing.po';
import Confirm from '../../pages/administration/confirm/confirm.po';
import ListingEditComponent from '../../components/listing/edit/listing-edit.po';
import LoginComponent from '../../components/login/login.sync.po';
import Hooks from '../../utilities/hooks';

let confirm;
let hooks;
let listingEditComponent;
let loginComponent;
let upload;

beforeAll(() => {
  upload = new Upload();
  confirm = new Confirm();
  listingEditComponent = new ListingEditComponent();
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  hooks.open('#/administration/upload');
  loginComponent.logIn('acb');
});

describe('an ACB user', () => {
  beforeEach(() => {
    hooks.open('#/administration/upload');
    upload.uploadFileAndWaitForListingsToBeProcessed('../../../resources/listings/2015_v19_AQA1.csv', ['15.04.04.1722.AQA1.03.01.1.200620'], hooks, confirm);
    hooks.open('#/administration/confirm/listings');
  });

  afterEach(() => {
    browser.refresh();
  });

  xit('should be able to add test procedure, test data, test tools, test functionality to uploaded listing (170.315 (b)(3) cures criteria)', () => {
    confirm.gotoConfirmListingPage('15.04.04.1722.AQA1.03.01.1.200620');
    listingEditComponent.openEditCriteria('170.315 (b)(3)', true);
    listingEditComponent.addTestFunctionality('(b)(3)(ii)(B)(4)');
    listingEditComponent.addTestProcedures('ONC Test Method - Surescripts (Alternative)', '1');
    listingEditComponent.addTestData('ONC Test Method', '2');
    listingEditComponent.addTestTools('Inferno', '3');
    listingEditComponent.saveCertifiedProduct.waitAndClick();
    listingEditComponent.viewDetailsCriteria('170.315 (b)(3)', true);
    expect(listingEditComponent.getTestFunctionalityDetail('170.315 (b)(3)', true).getText()).toContain('Request to send an additional supply of medication (Resupply)');
    expect(listingEditComponent.getTestProcedureDetail('170.315 (b)(3)', true).getText()).toContain('ONC Test Method - Surescripts (Alternative)');
    expect(listingEditComponent.getTestDataDetail('170.315 (b)(3)', true).getText()).toContain('ONC Test Method');
    expect(listingEditComponent.getTestToolDetail('170.315 (b)(3)', true).getText()).toContain('Inferno');
  });

  xit('should be able to remove uploaded test procedure, test tools (170.315 (b)(3) cures criteria)', () => {
    confirm.gotoConfirmListingPage('15.04.04.1722.AQA1.03.01.1.200620');
    listingEditComponent.openEditCriteria('170.315 (b)(3)', true);
    // Remove test tool
    listingEditComponent.removeTestProcToolData('Remove item HL7v2 Immunization Test Suite');
    // Remove test procedure
    listingEditComponent.removeTestProcToolData('Remove item ONC Test Method');
    listingEditComponent.saveCertifiedProduct.waitAndClick();
    listingEditComponent.viewDetailsCriteria('170.315 (b)(3)', true);
    expect(listingEditComponent.getTestProcedureDetail('170.315 (b)(3)', true).getText()).not.toContain('ONC Test Method');
    expect(listingEditComponent.getTestToolDetail('170.315 (b)(3)', true).getText()).not.toContain('HL7v2 Immunization Test Suite');
  });
});

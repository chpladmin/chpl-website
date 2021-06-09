module.exports = [
  {
    listingId: '13A!.AA.02.8990.AQA.0A@.AA.A.20230729',
    expectedErrors: ['Applicable criteria is required for each QMS Standard','The \'Accessibility Certified\' value is \'false\' but','Transparency Attestation URL','certification edition','No certification date','Testing Lab',' Edition code is required and must be 2 characters in length','ICS code is required and must be 2 characters in length','ONC-ATL code is required and must be 2 characters in length','additional software code is required and must be 1 character in length','certified date code is required and must be 6 characters in length','does not match the code of the declared developer','product code is required and must be 4 characters in length','version code is required and must be 2 characters in length','At least one certification result is required for the listing.'],
    expectedWarnings: ['An unrecognized character was found for ACB Certification ID'],
  },
  {
    listingId: '13.07.04.XXXX.AQA20.R2.01.4.230511',
    expectedErrors: ['name is required for each QMS Standard','Accessibility Standard(s) are required','The \'Accessibility Certified\' value is \'true\' but','Certification date','Developer city','Developer contact email address','Developer contact name','Developer contact phone number','state','street address','website','zipcode','Self developer value','additional software code is required','certification edition is required','edition code 13','product code is required','unique id indicates the product does have ICS but','At least one certification result is required for the listing'],
    expectedWarnings: [],
  },
  {
    listingId: '15.07.04.1234.AQA21.R2.00.0.200511',
    expectedErrors: ['The \'Accessibility Certified\' value is \'false\' but','developer does not yet exist in the system','No developer with the name \'New Developer\' was found','product code is required and must be 4 characters in length','the developer does not yet exist in the system','ONC-ACB test� is not valid.'],
    expectedWarnings: ['An unrecognized character was found for ACB Name'],
  },
  {
    listingId: '15.04.04.3007.AQA22.V1.00.0.200707',
    expectedErrors: ['QMS Standard(s) are required.','Accessibility Standard(s) are required.','ICS parent listings must reference existing listings in the CHPL','ICS parents must not be specified but at least one was found','ONC-ACB code','ONC-ATL code','developer code','product code','At least one certification result is required for the listing.'],
    expectedWarnings: [],
  },
  {
    listingId: '15.04.04.1722.AA23.V1.00.1.210607',
    expectedErrors: ['API Documentation is required for certification 170.315 (g)(10)','Certification 170.315 (a)(1) contains duplicate Test Procedure','Certification 170.315 (b)(1) (Cures Update) contains duplicate Test Data','Certification 170.315 (b)(1) (Cures Update) contains duplicate Test Tool','Criteria 170.315 (a)(1) contains an invalid test functionality','Criteria 170.315 (b)(1) (Cures Update) contains a test standard \'test standard\' which does not exist for edition 2015','Criteria 170.315 (b)(1) (Cures Update) contains an invalid test tool','Export Documentation is required for certification 170.315 (b)(10)','Listing has not attested to (g)(3), but at least one criteria was found attesting to SED.','Privacy and Security Framework is required for certification 170.315 (b)(10)','Service Base URL List is required for certification 170.315 (g)(10)','Test data version is required for certification 170.315 (b)(1) (Cures Update)','Test procedures are required for certification criteria 170.315 (b)(10)','The value for Documentation Url in criteria 170.315 (d)(13) is not a valid URL','The value for Use Cases in criteria 170.315 (d)(13) is not a valid URL','GAP cannot be set to True for 170.315 (f)(3)'],
    expectedWarnings: ['Certification 170.315 (a)(1) contains duplicate Test Functionality: Number \'(a)(1)(ii)\'. The duplicates have been removed.','Certification 170.315 (b)(1) (Cures Update) contains duplicate Test Standard: Number \'170.207(i)\'. The duplicates have been removed.','Certification 170.315 (d)(13) has a Use Case but no Attestation Answer.','Test data \'test data\' is invalid for certification 170.315 (b)(1) (Cures Update). ONC Test Method will be used instead.'],
  },
];

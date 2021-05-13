module.exports = [
  {
    listingId: '13A!.AA.02.8990.AQA.0A@.AA.A.20230729',
    expectedErrors: ['Applicable criteria is required for each QMS Standard','The \'Accessibility Certified\' value is \'false\' but','Transparency Attestation URL','certification edition','No certification date','Testing Lab',' Edition code is required and must be 2 characters in length','ICS code is required and must be 2 characters in length','ONC-ATL code is required and must be 2 characters in length','additional software code is required and must be 1 character in length','certified date code is required and must be 6 characters in length','does not match the code of the declared developer','product code is required and must be 4 characters in length','version code is required and must be 2 characters in length'],
    expectedWarnings: ['An unrecognized character was found for ACB Certification ID'],
  },
  {
    listingId: '13.07.04.XXXX.AQA20.R2.01.4.230511',
    expectedErrors: ['name is required for each QMS Standard','Accessibility Standard(s) are required','The \'Accessibility Certified\' value is \'true\' but','Certification date','Developer city','Developer contact email address','Developer contact name','Developer contact phone number','state','street address','website','zipcode','Self developer value','additional software code is required','certification edition is required','edition code 13','product code is required','unique id indicates the product does have ICS but'],
    expectedWarnings: [],
  },
  {
    listingId: '15.07.04.1234.AQA21.R2.00.0.200511',
    expectedErrors: ['The \'Accessibility Certified\' value is \'false\' but','developer does not yet exist in the system','No developer with the name \'New Developer\' was found','product code is required and must be 4 characters in length','the developer does not yet exist in the system','ONC-ACB test� is not valid.'],
    expectedWarnings: ['An unrecognized character was found for ACB Name'],
  },
  {
    listingId: '15.04.04.3007.AQA22.V1.00.0.200707',
    expectedErrors: ['QMS Standard(s) are required.','Accessibility Standard(s) are required.','ICS parent listings must reference existing listings in the CHPL','ICS parents must not be specified but at least one was found','ONC-ACB code','ONC-ATL code','developer code','product code'],
    expectedWarnings: [],
  },
];

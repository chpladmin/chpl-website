module.exports = [
  {
    listingId: '15.07.04.1234.AQA21.R2.00.0.200511',
    expectedErrors: [
      'No developer with the name \'New Developer\' was found in the system.',
      'The CHPL Product Number has a developer code of \'1234\' but the developer does not yet exist in the system. To indicate a new developer the CHPL Product Number should use the code \'XXXX\'.',
      'The unique id indicates the product does not have additional software but some is specified in the upload file.',
    ],
    expectedWarnings: [
    ],
  },
  {
    listingId: '15.04.04.1722.AQAU.V1.00.1.210607',
    expectedErrors: [
      'API Documentation is required for certification 170.315 (g)(10).',
      'Certification 170.315 (a)(1) contains duplicate Test Procedure: \'ONC Test Method\'.',
      'Certification 170.315 (b)(1) (Cures Update) contains duplicate Test Data: Name \'ONC Test Method\'.',
      'Certification 170.315 (b)(1) (Cures Update) contains duplicate Test Tool: Name \'Edge Testing Tool\'.',
      'Criteria 170.315 (a)(1) contains an invalid test functionality \'(a)(1)(ii)123\'. It has been removed from the pending listing.',
      'Criteria 170.315 (b)(1) (Cures Update) contains an invalid test tool \'test tool\'. It has been removed from the pending listing.',
      'Criteria 170.315 (d)(12) indicates additional software should be present but none was found.',
      'Export Documentation is required for certification 170.315 (b)(10).',
      'Service Base URL List is required for certification 170.315 (g)(10).',
      'Test data version is required for certification 170.315 (b)(1) (Cures Update).',
      'The value for Documentation Url in criteria 170.315 (d)(13) is not a valid URL.',
      'The value for Use Cases in criteria 170.315 (d)(13) is not a valid URL.'
    ],
    expectedWarnings: ['The test participant with unique ID \'ID02\' is never referenced in the listing and will be ignored.',
      'Certification 170.315 (a)(1) contains duplicate Test Functionality: Number \'(a)(1)(ii)\'. The duplicates have been removed.',
      'Certification 170.315 (d)(13) has a Use Case but no Attestation Answer.',
      'Test data \'test data\' is invalid for certification 170.315 (b)(1) (Cures Update). ONC Test Method will be used instead.'
    ],
  },
  {
    listingId: '15.04.04.1722.AQAU.V2.00.1.210607',
    expectedErrors: [
      'Service Base URL List is required for certification 170.315 (g)(10)'
    ],
    expectedWarnings: [],
  },

  {
    listingId: '15.04.04.1722.AQAC.V1.00.1.210607',
    expectedErrors: [
     
      'Service Base URL List is required for certification 170.315 (g)(10)',
    ],
    expectedWarnings: [],
  },
];

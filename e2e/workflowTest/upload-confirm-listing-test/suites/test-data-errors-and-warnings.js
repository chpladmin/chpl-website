const suite = {
  description: 'with issues related to test data',
  file: '../../../resources/listings/2015_TestData.csv',
  listings: [{
    listingId: '15.04.04.1722.TDAT.V1.00.1.210607',
    expectedErrors: [
      'Test data version is required for certification 170.315 (b)(7) (Cures Update).',
      'Certification 170.315 (b)(7) (Cures Update) contains duplicate Test Data: Name \'ONC Test Method\'.',
    ],
    expectedWarnings: [
      'Test data \'BAD TD\' is invalid for the criterion 170.315 (b)(7) (Cures Update) and has been removed from the listing.',
      'Test Data is not applicable for the criterion 170.315 (g)(7). It has been removed.',
      'Certification 170.315 (b)(7) (Cures Update) contains duplicate Test Data: Name \'ONC Test Method\', Version \'v1\'. The duplicates have been removed.',
    ],
  }],
};

export default suite;

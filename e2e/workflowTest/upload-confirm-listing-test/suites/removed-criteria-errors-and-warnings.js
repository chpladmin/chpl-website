const suite = {
  description: 'with a removed criteria that has invalid sub-data',
  file: '../../../resources/upload-listing-beta/2015_RemovedCriteria.csv',
  listings: [{
    listingId: '15.02.04.2701.RMVD.12.00.1.200620',
    expectedErrors: [
      'The criterion 170.315 (a)(6) has been removed and may not be added to the listing.',
    ],
    expectedWarnings: [
      'Certification criterion 170.315 (a)(*) was found so 170.315 (d)(3) or 170.315 (d)(3) (Cures Update) is required but was not found.',
      'Certification criterion 170.315 (a)(*) was found so 170.315 (d)(6) is required but was not found.',
      'Certification criterion 170.315 (a)(*) was found so 170.315 (d)(4) is required but was not found.',
      'Certification criterion 170.315 (a)(*) was found so 170.315 (d)(7) is required but was not found.',
      'Certification criterion 170.315 (a)(*) was found so 170.315 (d)(5) is required but was not found.',
      'The value for Documentation Url in criteria 170.315 (a)(6) is not a valid URL.',
      'Certification criterion 170.315 (a)(*) was found so 170.315 (d)(2) or 170.315 (d)(2) (Cures Update) is required but was not found.',
      'The value for Use Cases in criteria 170.315 (a)(6) is not a valid URL.',
      'Certification criterion 170.315 (a)(*) was found so 170.315 (d)(1) is required but was not found.',
      'Listing has not attested to (g)(3), but at least one criteria was found attesting to SED.'
    ],
  }],
};

export default suite;

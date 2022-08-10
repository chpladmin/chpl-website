const suite = {
  description: 'with a removed criteria that has invalid sub-data',
  file: '../../../resources/listings/2015_RemovedCriteria.csv',
  listings: [{
    listingId: '15.02.04.2701.RMVD.12.00.1.200620',
    expectedErrors: [
      'The criterion 170.315 (a)(6) has been removed and may not be added to the listing.',
    ],
    expectedWarnings: [
      'Listing has not attested to (g)(3), but at least one criteria was found attesting to SED.',
    ],
  }],
};

export default suite;

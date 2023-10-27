const suite = {
  description: 'with a removed criteria that has invalid sub-data',
  file: '../../../resources/listings/2015_RemovedCriteria.csv',
  listings: [{
    listingId: '15.02.04.2701.RMVD.12.00.1.220920',
    expectedErrors: [
      'The criterion 170.315 (a)(6) is unavailable for this listing.',
    ],
    expectedWarnings: [
    ],
  }, {
    listingId: '15.02.04.2701.RMVD.12.00.1.190920',
    expectedErrors: [
      'The criterion 170.315 (a)(6) was removed more than 1 year ago and may not be modified.',
    ],
    expectedWarnings: [
    ],
  }],
};

export default suite;

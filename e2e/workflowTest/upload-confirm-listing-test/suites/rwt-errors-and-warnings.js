const suite = {
  description: 'with Real World Testing errors or warnings',
  file: '../../../resources/listings/RealWorldTesting.csv',
  listings: [{
    listingId: '15.05.05.3188.RWT1.01.00.0.240312',
    expectedErrors: [
    ],
    expectedWarnings: [
    ],
  }, {
    listingId: '15.05.05.3188.RWT2.01.00.0.240312',
    expectedErrors: [
        'Real World Testing Results URL is not a well formed URL.',
        'Real World Testing Results Check Date \'n/a\' is not a valid date format. Please enter date as yyyyMMdd.',
        'Real World Testing Plans URL is not a well formed URL.',
        'Real World Testing Plans Check Date \'Jany 7 1998\' is not a valid date format. Please enter date as yyyyMMdd.',
    ],
    expectedWarnings: [
    ],
  }],
};

export default suite;

const suite = {
  description: 'with Code Sets errors or warnings',
  file: '../../../resources/listings/CodeSets.csv',
  listings: [{
    listingId: '15.05.05.3188.MYRD.01.00.0.240312',
    expectedErrors: [
    ],
    expectedWarnings: [
    ],
  }, {
    listingId: '15.05.05.3188.MYRD.01.00.0.240310',
    expectedErrors: [
    ],
    expectedWarnings: [
        'Code Set Dec 2025 for Criterion 170.315 (a)(12) has a Start Day of 2024-03-11 and is not available. It has been removed.',
    ],
  }, {
    listingId: '15.05.05.3188.MYRD.01.00.0.240313',
    expectedErrors: [
    ],
    expectedWarnings: [
        'Code Set Junk 2000 for Criterion 170.315 (a)(12) does not exist. It has been removed.',
        'Code Set Bogus for Criterion 170.315 (a)(12) does not exist. It has been removed.',
        'Code Set Bad Codeset for Criterion 170.315 (a)(12) does not exist. It has been removed.',
    ],
  }, {
    listingId: '15.05.05.3188.MYRD.01.00.0.240314',
    expectedErrors: [
    ],
    expectedWarnings: [
        'Certification 170.315 (a)(12) contains duplicate Code Set: \'Dec 2025\'. The duplicates have been removed.',
    ],
  }],
};

export default suite;

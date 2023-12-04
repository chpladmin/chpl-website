const suite = {
  description: 'with no errors and no warnings',
  file: '../../../resources/listings/2015_MinimumViableListing.csv',
  listings: [{
    listingId: '15.02.04.2701.MVL1.12.00.1.220620',
    expectedErrors: [
    ],
    expectedWarnings: [
      'No ONC-ATLs were provided. The ONC-ATL \'UL LLC\' was used based on the CHPL Product Number.',
    ],
  }],
};

export default suite;

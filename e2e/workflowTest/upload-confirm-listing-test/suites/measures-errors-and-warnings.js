const suite = {
  description: 'with issues related to measures specified at the listing level',
  file: '../../../resources/upload-listing-beta/2015_Measures.csv',
  listings: [{
    listingId: '15.04.04.1722.MEA4.V1.00.1.210607',
    expectedErrors: [

    ],
    expectedWarnings: [],
  }, {
    listingId: '15.04.04.1722.MEA5.V1.00.1.210607',
    expectedErrors: [],
    expectedWarnings: [],
  }],
};

export default suite;

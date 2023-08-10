const suite = {
  description: 'when doing fuzzy matching on QMS Standards',
  file: '../../../resources/listings/2015_FuzzyMatching.csv',
  listings: [{
    listingId: '15.02.04.2701.FUZZ.12.00.1.200620',
    expectedErrors: [],
    expectedWarnings: [
      'The QMS Standard value was changed from Home Grown mapped to ISO 9002 to Home Grown mapped to ISO 9001.',
    ],
  }],
};

export default suite;

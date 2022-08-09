const suite = {
  description: 'with issues in the column headings',
  file: '../../../resources/listings/2015_BogusColumns.csv',
  listings: [{
    listingId: '15.02.04.2701.COLS.12.00.1.200620',
    expectedErrors: [
      'The heading \'Test procedure version\' appears to be a duplicate for certification result CRITERIA_170_315_G_4__C.',
      'The heading \'Test Procedure\' appears to be a duplicate for certification result CRITERIA_170_315_G_5__C.',
      'The heading \'QMS Modification Description\' appears to be a duplicate in the file.',
      'The heading \'PRODUCT\' appears to be a duplicate in the file.',
      'The heading \'CRITERIA_170_315_G_5__C\' appears to be a duplicate in the file.',
    ],
    expectedWarnings: [
      'The heading \'CRITERIA_170_315_R_5__C\' was found in the upload file but is not recognized.',
      'The heading \'Bogus col4\' was found in the upload file but is not recognized.',
      'The heading \'Bogus col3\' was found in the upload file but is not recognized.',
      'The heading \'Bogus col2\' was found in the upload file but is not recognized.',
      'The heading \'Bogus col1\' was found in the upload file but is not recognized.',
    ],
  }],
};

export default suite;

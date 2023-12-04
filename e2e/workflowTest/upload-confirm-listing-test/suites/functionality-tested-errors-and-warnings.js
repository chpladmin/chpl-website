const suite = {
  description: 'with issues related to functionality tested',
  file: '../../../resources/listings/2015_FunctionalityTested.csv',
  listings: [{
    listingId: '15.04.04.1722.FNT1.V1.00.1.210607',
    expectedErrors: [
    ],
    expectedWarnings: [
    ],
  }, {
    listingId: '15.04.04.1722.FNT2.V1.00.1.210607',
    expectedErrors: [
    ],
    expectedWarnings: [
      'Functionality tested is not applicable for the criterion 170.315 (c)(3). It has been removed.',
      'Criteria 170.315 (b)(1) contains an invalid Functionality Tested \'notafunctionalitytested\'. It has been removed from the pending listing.',
      'Criteria 170.315 (b)(1) contains an invalid Functionality Tested \'(g)(5)(i)\'. It has been removed from the pending listing.',
      'Certification 170.315 (d)(7) contains duplicate Functionality Tested: Number \'(d)(7)(i)\'. The duplicates have been removed.',
    ],
  }],
};

export default suite;

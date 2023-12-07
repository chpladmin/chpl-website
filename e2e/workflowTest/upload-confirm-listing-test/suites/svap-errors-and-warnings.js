const suite = {
  description: 'with SVAP errors or warnings',
  file: '../../../resources/listings/2015_SVAP.csv',
  listings: [{
    listingId: '15.02.04.2701.SVP1.12.00.1.220920',
    expectedErrors: [
      'Standards Version Advancement Process 170.205(h)(3); 170.205(k)(3) for criteria 170.315 (c)(3) has been replaced and is only allowable for listings with ICS.',
    ],
    expectedWarnings: [
      'Standards Version Advancement Process(es) are not applicable for the criterion 170.315 (g)(5). They have been removed.',
    ],
  }, {
    listingId: '15.02.04.2701.SVP2.12.00.1.220920',
    expectedErrors: [
    ],
    expectedWarnings: [
      'Standards Version Advancement Process 170.204(a)(1) is not valid for criteria 170.315 (c)(3). It has been removed.',
      'Standards Version Advancement Process 170.204(a)(2) is not valid for criteria 170.315 (f)(7). It has been removed.',
      'Standards Version Advancement Process 170.205(s)(1) is not valid for criteria 170.315 (e)(1). It has been removed.',
    ],
  }, {
    listingId: '15.02.04.2701.SVP3.12.00.1.220920',
    expectedErrors: [
    ],
    expectedWarnings: [
    ],
  }],
};

export default suite;

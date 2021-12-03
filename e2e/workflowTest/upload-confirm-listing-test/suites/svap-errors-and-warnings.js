const suite = {
  description: 'with SVAP errors or warnings',
  file: '../../../resources/upload-listing-beta/2015_SVAP.csv',
  listings: [{
    listingId: '15.02.04.2701.SVP1.12.00.1.200620',
    expectedErrors: [
      'Standards Version Advancement Process 170.205(h)(3); 170.205(k)(3) is not valid for criteria 170.315 (c)(3). It has been removed.',
    ],
    expectedWarnings: [
      'Standards Version Advancement Process(es) are not applicable for the criterion 170.315 (g)(5). They have been removed.',
    ],
  }, {
    listingId: '15.02.04.2701.SVP2.12.00.1.200620',
    expectedErrors: [
      'Standards Version Advancement Process 170.205(s)(1) is not valid for criteria 170.315 (e)(1) (Cures Update). It has been removed.',
      'Standards Version Advancement Process 170.204(a)(2) is not valid for criteria 170.315 (f)(7). It has been removed.',
      'Standards Version Advancement Process 170.204(a)(1) is not valid for criteria 170.315 (c)(3) (Cures Update). It has been removed.',
    ],
    expectedWarnings: [
    ],
  }, {
    listingId: '15.02.04.2701.SVP3.12.00.1.200620',
    expectedErrors: [
    ],
    expectedWarnings: [
    ],
  }],
};

export default suite;

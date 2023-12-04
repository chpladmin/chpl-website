const suite = {
  description: 'with issues related to optional standards',
  file: '../../../resources/listings/2015_OptionalStandards.csv',
  listings: [{
    listingId: '15.04.04.1722.OPTS.V1.00.1.210607',
    expectedErrors: [
      'Criteria 170.315 (b)(1) contains an optional standard \'BAD OS\' which does not exist.',
      'Optional Standard 170.204(a)(2) is not valid for criteria 170.315 (b)(1).',
      '170.315 (g)(3) is required but was not found.',
      'Listing has not attested to (g)(3), but at least one criteria was found attesting to SED.',
    ],
    expectedWarnings: [
      'Optional Standards are not applicable for the criterion 170.315 (a)(1). They have been removed.',
      'Certification 170.315 (b)(1) contains duplicate Optional Standard: \'170.207(a)(4)\'. The duplicates have been removed.',
    ],
  }],
};

export default suite;

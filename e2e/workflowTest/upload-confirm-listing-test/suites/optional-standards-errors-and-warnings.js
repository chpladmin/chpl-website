const suite = {
  description: 'with issues related to optional standards',
  file: '../../../resources/listings/2015_OptionalStandards.csv',
  listings: [{
    listingId: '15.04.04.1722.OPTS.V1.00.1.210607',
    expectedErrors: [
      'Criteria 170.315 (b)(1) contains an optional standard \'BAD OS\' which does not exist.',
      'Optional Standard WCAG 2.0, Level AA Conformance is not valid for criteria 170.315 (b)(1).',
      '170.315 (g)(3) is required but was not found.',
      'Listing has not attested to (g)(3), but at least one criteria was found attesting to SED.',
    ],
    expectedWarnings: [
      'Optional Standards are not applicable for the criterion 170.315 (a)(1). They have been removed.',
      'Optional Standard \'SNOMED CT\' was changed to \'SNOMED CT®\' for criteria 170.315 (b)(1).',
      'Certification 170.315 (b)(1) contains duplicate Optional Standard: \'SNOMED CT®\'. The duplicates have been removed.',
    ],
  }],
};

export default suite;

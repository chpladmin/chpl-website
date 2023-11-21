const suite = {
  description: 'with issues related to conformance methods',
  file: '../../../resources/listings/2015_ConformanceMethods.csv',
  listings: [{
    listingId: '15.02.04.2701.CM01.12.00.1.220920',
    expectedErrors: [
      'Conformance Method Version is required for certification 170.315 (g)(3) with Conformance Method "ONC Test Procedure".',
      'Conformance Method Version is required for certification 170.315 (g)(5) with Conformance Method "ONC Test Procedure".',
    ],
    expectedWarnings: [
      'Conformance Method Version is not allowed for certification 170.315 (a)(1) with Conformance Method "Attestation". The version "4" has been removed.',
      'Conformance Method "ONC Test Method - Surescripts (Alternative)" is not valid for criteria 170.315 (a)(1). It has been removed.',
      'Conformance Method "NCQA eCQM Test Method" is not valid for criteria 170.315 (a)(1). It has been removed.',
      'Conformance Method "HIMSS-IIP Test Method" is not valid for criteria 170.315 (a)(1). It has been removed.',
      'Criterion 170.315 (g)(3) requires a Conformance Method but none was found. "ONC Test Procedure" was added.',
      'Certification 170.315 (g)(4) contains duplicate Conformance Method: Name \'ONC Test Procedure\', Version \'3\'. The duplicates have been removed.',
    ],
  }],
};

export default suite;

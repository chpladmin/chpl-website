const suite = {
  description: 'with issues with CQMs',
  file: '../../../resources/listings/2015_CQMs.csv',
  listings: [{
    listingId: '15.02.04.2701.CQM1.12.00.1.220920',
    expectedErrors: [
      'The CQM with CMS ID \'CMS2\' does not specify a version. A version is required.',
      'The CQM with CMS ID \'CMS72\' has an invalid version \'v19\'.',
      'Clinical Quality Measurement CMS134 was found under Certification criterion 170.315 (c)(1), but the product does not attest to that criterion.',
      'Clinical Quality Measurement CMS134 was found under Certification criterion 170.315 (c)(3) (Cures Update), but the product does not attest to that criterion.',
    ],
    expectedWarnings: [
      'A CQM was found with versions or criteria specified but is missing the required CMS ID. The CQM has been removed.',
      'CMS ID \'CMStest\' is not valid. The CQM has been removed.',
      'Removed invalid criterion d10 from Clinical Quality Measurement CMS134.'
    ],
  }, {
    listingId: '15.02.04.2701.CQM2.12.00.1.220920',
    expectedErrors: [
      'Certification criterion \'170.315 (c)(1)\' was found but no matching Clinical Quality Measurement was found.',
      'Certification criterion \'170.315 (c)(2)\' was found but no matching Clinical Quality Measurement was found.',
      'Certification criterion \'170.315 (c)(3) (Cures Update)\' was found but no matching Clinical Quality Measurement was found.',
      'Certification criterion \'170.315 (c)(4)\' was found but no matching Clinical Quality Measurement was found.',
    ],
    expectedWarnings: [
    ],
  }],
};

export default suite;

module.exports = [
  {
    listingId: '15.02.04.2701.CQM1.12.00.1.200620',
    expectedErrors: [
      'The CQM with CMS ID \'CMS2\' does not specify a version. A version is required.',
      'A CQM was found with versions or criteria specified but is missing the required CMS ID.',
      'CMS ID \'CMStest\' is not a valid.',
      'The CQM with CMS ID \'CMS72\' has an invalid version \'v19\'.',
      'Clinical Quality Measurement CMS134 was found under Certification criterion 170.315 (c)(1), but the product does not attest to that criterion.',
      'Clinical Quality Measurement CMS134 was found under Certification criterion c3, but the product does not attest to that criterion.',
      'Clinical Quality Measurement CMS134 was found under Certification criterion d10, but the product does not attest to that criterion.'
    ],
    expectedWarnings: [
    ],
  },
  {
    listingId: '15.02.04.2701.CQM2.12.00.1.200620',
    expectedErrors: [
      'Certification criterion \'170.315 (c)(1)\' was found but no matching Clinical Quality Measurement was found.',
      'Certification criterion \'170.315 (c)(2)\' was found but no matching Clinical Quality Measurement was found.',
      'Certification criterion \'170.315 (c)(3)\' was found but no matching Clinical Quality Measurement was found.',
      'Certification criterion \'170.315 (c)(4)\' was found but no matching Clinical Quality Measurement was found.'
    ],
    expectedWarnings: [
    ],
  },
  {
    listingId: '15.02.04.2701.CQM3.12.00.1.200620',
    expectedErrors: [
      'Certification criterion \'170.315 (c)(3) (Cures Update)\' was found but no matching Clinical Quality Measurement was found.',
    ],
    expectedWarnings: [
    ],
  },
];

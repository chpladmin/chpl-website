const suite = {
  description: 'with Standards errors or warnings',
  file: '../../../resources/listings/Standards.csv',
  listings: [{
    listingId: '15.04.04.1722.SND1.V1.00.1.210607',
    expectedErrors: [
    ],
    expectedWarnings: [
      'Required standards were added to 170.315 (b)(1), 170.315 (c)(3), and 170.315 (f)(5).',
      'Criteria 170.315 (d)(7) contains an invalid Standard \'170.205(a)(4)\'. It has been removed from the pending listing.',
      'Criteria 170.315 (d)(2) contains an invalid Standard \'bad standard\'. It has been removed from the pending listing.',
      'Criteria 170.315 (d)(1) contains an invalid Standard \'170.205(o)(1)\'. It has been removed from the pending listing.',
      'Certification 170.315 (c)(2) contains duplicate Standard: Number \'170.205(h)(2)\'. The duplicates have been removed.',
    ],
  }, {
    listingId: '15.04.04.1722.SND2.V1.00.1.230607',
    expectedErrors: [
      'The Standard Quality Reporting Document Architecture Category III, Implementation Guide for CDA Release 2 on the criterion 170.315 (c)(3) is unavailable for this listing.',
      'The Standard HL7 CDA® Release 2 Implementation Guide for: Quality Reporting Document Architecture – Category I (QRDA I); Release 1, DSTU Release 3 (US Realm), Volume 1 on the criterion 170.315 (c)(3) is unavailable for this listing.',
      'The Standard Errata to the HL7 Implementation Guide for CDA® Release 2: Quality Reporting Document Architecture—Category III, DSTU Release 1 (US Realm), September 2014 on the criterion 170.315 (c)(3) is unavailable for this listing.',
    ],
    expectedWarnings: [
    ],
  }, {
    listingId: '15.04.04.1722.SND3.V1.00.1.210607',
    expectedErrors: [
    ],
    expectedWarnings: [
    ],
  }],
};

export default suite;

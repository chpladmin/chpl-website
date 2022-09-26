const suite = {
  description: 'with issues related to measures specified at the listing level',
  file: '../../../resources/listings/2015_Measures.csv',
  listings: [{
    listingId: '15.04.04.1722.MEA4.V1.00.1.210607',
    expectedErrors: [
      'The G1 measure Electronic Prescribing: Eligible Clinician for RT1 cannot have associated criterion 170.315 (b)(2).',
      'The G1 measure Electronic Prescribing: Eligible Clinician for RT1 cannot have associated criterion 170.315 (b)(2) (Cures Update).',
      'Invalid G1/G2 Measure Type: \'G5\' was not found.',
    ],
    expectedWarnings: [
      'The G1 measure Electronic Prescribing: Eligible Clinician for RT1 has an invalid associated criterion notacriterionatall. The criterion has been removed from the measure.',
      'G2 Measure \'KEE + RT1\' was not found and has been removed from the listing.',
      'G2 Measure \'KEE + RT1\' was not found associated with 170.315 (g)(10) (Cures Update) and has been removed from the listing.',
      'G1 Measure \'EC + RT7283\' was not found and has been removed from the listing.',
      'G1 Measure \'EC + RT7283\' was not found associated with 170.315 (a)(1) and has been removed from the listing.',
      'Duplicate G5 Measure: Electronic Prescribing: Eligible Clinician for RT1 was found with the same relevant criteria. The duplicates have been removed.',
    ],
  }, {
    listingId: '15.04.04.1722.MEA5.V1.00.1.210607',
    expectedErrors: [
      'The G1 measure Provide Patients Electronic Access to Their Health Information (formerly Patient Electronic Access): Eligible Clinician for RT2 must have at least one associated criterion.',
      'G1/G2 Measure Type is missing.',
    ],
    expectedWarnings: [
      'G2 Measure \'EC\' was not found associated with 170.315 (e)(1) and has been removed from the listing.',
      'G2 Measure \'RT1\' was not found associated with 170.315 (e)(1) and has been removed from the listing.',
      'G1 Measure \'\' was not found and has been removed from the listing.',
      'Measure \'EC\' was not found and has been removed from the listing.',
      'Measure \'RT1\' was not found and has been removed from the listing.',
      'Measure \'\' was not found associated with 170.315 (e)(1), 170.315 (g)(8), 170.315 (g)(9) and has been removed from the listing.',
    ],
  }, {
    listingId: '15.04.04.1722.MEA6.V1.00.1.210607',
    expectedErrors: [],
    expectedWarnings: [],
  }, {
    listingId: '15.04.04.1722.MEA7.V1.00.1.210607',
    expectedErrors: [
      'The G2 Measure: Patient Electronic Access: Eligible Professional for RT2 may not be referenced since this listing does not have ICS. The measure has been removed.',
      'The G1 Measure: Patient-Specific Education: Eligible Professional for RT3 may not be referenced since this listing does not have ICS. The measure has been removed.',
      'The G1 Measure: Electronic Prescribing: Eligible Clinician for RT1 may not be referenced since this listing does not have ICS. The measure has been removed.',
      'The G2 Measure: Patient Care Record Exchange: Eligible Professional for RT7 may not be referenced since this listing does not have ICS. The measure has been removed.',
      'The G1 Measure: Patient Care Record Exchange: Eligible Professional for RT7 may not be referenced since this listing does not have ICS. The measure has been removed.',
    ],
    expectedWarnings: [],
  }, {
    listingId: '15.04.04.1722.MEA8.V1.00.1.210607',
    expectedErrors: [
      'Listing has attested to (g)(2), but no measures have been successfully tested for (g)(2).',
      'Listing has attested to (g)(1), but no measures have been successfully tested for (g)(1).',
    ],
    expectedWarnings: [],
  }],
};

export default suite;

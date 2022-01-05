const suite = {
  description: 'with issues related to measures',
  file: '../../../resources/upload-listing-beta/2015_Measures.csv',
  listings: [{
    listingId: '15.04.04.1722.MEA1.V1.00.1.210607',
    expectedErrors: [
      '170.315 (g)(3) is required but was not found.',
      'The G1 Measure: Electronic Prescribing: Eligible Professional for RT1 may not be referenced since this listing does not have ICS. The measure has been removed.',
      'The G1 Measure: Medication/Clinical Information Reconciliation: Eligible Professional for RT9 may not be referenced since this listing does not have ICS. The measure has been removed.',
      'The G1 Measure: Patient Care Record Exchange: Eligible Professional for RT7 may not be referenced since this listing does not have ICS. The measure has been removed.',
      'The G1 Measure: Patient Electronic Access: Eligible Professional for RT2 may not be referenced since this listing does not have ICS. The measure has been removed.',
      'The G2 Measure: Electronic Prescribing: Eligible Professional for RT1 may not be referenced since this listing does not have ICS. The measure has been removed.',
      'The G2 Measure: Medication/Clinical Information Reconciliation: Eligible Professional for RT9 may not be referenced since this listing does not have ICS. The measure has been removed.',
      'The G2 Measure: Patient Care Record Exchange: Eligible Professional for RT7 may not be referenced since this listing does not have ICS. The measure has been removed.',
      'The G2 Measure: Patient Electronic Access: Eligible Professional for RT2 may not be referenced since this listing does not have ICS. The measure has been removed.',
    ],
    expectedWarnings: [],
  }, {
    listingId: '15.04.04.1722.MEA2.V1.00.1.210607',
    expectedErrors: [
      '170.315 (g)(3) is required but was not found.',
      'Listing has attested to (g)(1), but no measures have been successfully tested for (g)(1).',
      'Listing has attested to (g)(2), but no measures have been successfully tested for (g)(2).',
      'Test data was not provided for certification 170.315 (b)(2) (Cures Update).',
    ],
    expectedWarnings: [],
  }, {
    listingId: '15.04.04.1722.MEA3.V1.00.1.210607',
    expectedErrors: [
      '170.315 (g)(3) is required but was not found.',
      'Test data \'BAD test method\' is invalid for the criterion 170.315 (b)(2) (Cures Update).',
    ],
    expectedWarnings: [
      'G2 Measure \'NOTAMEASURE\' was not found associated with 170.315 (g)(10) and has been removed from the listing.',
      'G1 Measure \'JUNK\' was not found associated with 170.315 (g)(10) and has been removed from the listing.',
      'G1 Measure \'EP Stage 3\' was not found associated with 170.315 (e)(3) and has been removed from the listing.',
      'G2 Measure \'EP Stage 3\' was not found associated with 170.315 (e)(3) and has been removed from the listing.',
    ],
  }],
};

export default suite;

module.exports = [
  {
    listingId: '15.04.04.1722.OPTS.V1.02.1.210607',
    expectedErrors: [
      'Criteria 170.315 (b)(1) (Cures Update) contains an optional standard \'BAD OS\' which does not exist.',
      'Optional Standard 170.204(a)(2) is not valid for criteria 170.315 (b)(1) (Cures Update).',
      '170.315 (g)(3) is required but was not found.',
      'No listing was found with the unique ID \'15.07.04.2916.smar.07.01.1.190328\'. ICS parent listings must reference existing listings in the CHPL.'
    ],
    expectedWarnings: [
      'Optional Standards are not applicable for the criterion 170.315 (a)(1). They have been removed.',
      'Certification 170.315 (b)(1) (Cures Update) contains duplicate Optional Standard: \'170.207(a)(4)\'. The duplicates have been removed.',
    ],
  },
];

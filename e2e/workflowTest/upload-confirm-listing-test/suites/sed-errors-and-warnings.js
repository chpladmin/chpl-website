const suite = {
  description: 'with issues related to SED',
  file: '../../../resources/listings/2015_SED.csv',
  listings: [{
    listingId: '15.07.04.2701.SED1.R2.00.1.220911',
    expectedErrors: [
      '170.315 (g)(3) is required but was not found.',
      'Listing has not attested to (g)(3), but at least one criteria was found attesting to SED.',
      'Age range 55 for participant ID01 is an invalid value.',
      'Assistive Technology Needs are required for participant ID01.',
      'Computer Experience (in months) has an invalid value \'5.5\' for participant ID01. The field must be a whole number.',
      'Education level School for participant ID01 is an invalid value.',
      'Gender is required for participant ID01.',
      'Occupation is required for participant ID01.',
      'Product Experience (in months) has an invalid value \'C\' for participant ID01. The field must be a whole number.',
      'Professional Experience (in months) has an invalid value \'A\' for participant ID01. The field must be a whole number.',
      'The test task A1.1 for criteria 170.315 (a)(1) requires a Task Rating Standard Deviation value.',
      'The test task A1.1 for criteria 170.315 (a)(1) requires at least 10 participants.',
      'The test task A1.2 for criteria 170.315 (a)(1) has an invalid Task Path Deviation Observed value \'I\'. This field must be a number.',
      'The test task A1.2 for criteria 170.315 (a)(1) has an invalid Task Path Deviation Optimal value \'J\'. This field must be a number.',
      'The test task A1.2 for criteria 170.315 (a)(1) has an invalid Task Success Average value \'G\'. This field must be a number.',
      'The test task A1.2 for criteria 170.315 (a)(1) has an invalid Task Success Standard Deviation value \'H\'. This field must be a number.',
      'The test task A1.2 for criteria 170.315 (a)(1) has an invalid Task Time Deviation Observed Average value \'M\'. This field must be a number.',
      'The test task A1.2 for criteria 170.315 (a)(1) has an invalid Task Time Deviation Optimal Average value \'N\'. This field must be a number.',
      'The test task A1.2 for criteria 170.315 (a)(1) has an invalid Task Time Standard Deviation value \'L\'. This field must be a number.',
      'The test task A1.2 for criteria 170.315 (a)(1) requires a description.',
      'The test task A1.2 for criteria 170.315 (a)(1) requires at least 10 participants.',
    ],
    expectedWarnings: [
      'A non-integer numeric number was found in Test Task "A1.1" "Task Time Average" "80.7". The number has been rounded to "81".',
      'The test participant with unique ID \'ID02\' is never referenced in the listing and will be ignored.',
    ],
  },
  {
    listingId: '15.07.04.2701.SED2.R2.00.1.220911',
    expectedErrors: [
      '170.315 (g)(3) is required but was not found.',
      'Listing has not attested to (g)(3), but at least one criteria was found attesting to SED.',
      'Certification 170.315 (a)(1) requires at least one UCD process.',
      'Certification 170.315 (a)(1) requires at least one test task.',
    ],
    expectedWarnings: [
    ],
  }],
};

export default suite;

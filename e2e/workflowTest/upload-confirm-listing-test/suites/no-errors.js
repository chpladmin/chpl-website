const suite = {
  description: 'with no errors',
  file: '../../../resources/listings/2015_v19_AQA4.csv',
  listings: [{
    listingId: '15.04.04.1722.AQA4.03.01.1.200620',
    expectedErrors: [
    ],
    expectedWarnings: [
      'The user-entered developer street address of \'1061 Red Venture Drive Suite 130\' does not match the system value of \'1061 Red Ventures Dr. Suite 130\'.',
      'The user-entered developer self-developer of \'1\' does not match the system value of \'false\'.',
      'The user-entered developer point of contact name of \'Chris Boston\' does not match the system value of \'Gary Hamilton\'.',
      'The user-entered developer phone number of \'704-347-0661\' does not match the system value of \'704-347-0661 x5250\'.',
      'The user-entered developer email address of \'cboston@intelichart.com\' does not match the system value of \'ghamilton@intelichart.com\'.',
      'Certification 170.315 (b)(1) contains duplicate Test Data: Name \'ONC Test Method\', Version \'1\'. The duplicates have been removed.',
    ],
  }],
};

export default suite;

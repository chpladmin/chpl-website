module.exports = [
  {
    listingId: '15.02.04.1234.DEV1.12.00.1.200620',
    expectedErrors: [
      'No developer with the name \'1234 Developer\' was found in the system.',
      'The CHPL Product Number has a developer code of \'1234\' but the developer does not yet exist in the system. To indicate a new developer the CHPL Product Number should use the code \'XXXX\'.',
    ],
    expectedWarnings: [
    ],
  },
  {
    listingId: '15.02.04.2702.DEV2.12.00.1.200620',
    expectedErrors: [
      'The developer code from the CHPL Product Number 2702 does not match the code of the declared developer 2701.',
    ],
    expectedWarnings: [
    ],
  },
  {
    listingId: '15.02.04.XXXX.DEV3.12.00.1.200620',
    expectedErrors: [
      'Self developer value is missing.',
      'Developer zipcode is required.',
      'Developer website is required.',
      'Developer street address is required.',
      'Developer state is required.',
      'Developer contact phone number is required.',
      'Developer contact name is required.',
      'Developer contact email address is required.',
      'Developer city is required.',
    ],
    expectedWarnings: [
    ]
  }
];

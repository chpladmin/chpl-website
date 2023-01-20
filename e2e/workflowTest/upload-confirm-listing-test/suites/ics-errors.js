const suite = {
  description: 'with invalid ICS data',
  file: '../../../resources/listings/2015_ICS.csv',
  listings: [{
    listingId: '15.02.04.2701.ICS1.12.00.0.200620',
    expectedErrors: [
      'The unique id indicates the product does not have ICS but the value for Inherited Certified Status is true.',
      'No listing was found with the unique ID \'CHP-00000\'. ICS parent listings must reference existing listings in the CHPL.',
    ],
    expectedWarnings: [
    ],
  }],
};

export default suite;

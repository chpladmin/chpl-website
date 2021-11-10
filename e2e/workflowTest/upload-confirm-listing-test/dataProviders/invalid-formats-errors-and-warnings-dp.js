module.exports = [
  {
    listingId: '13A!.AA.04.8990.FMT.0A@.AA.A.20230729',
    expectedErrors: [
      'The version code is required and must be 2 characters in length containing only the characters A-Z, a-z, 0-9, and _.',
      'The value for Mandatory Disclosures \'examplek1.com\' is not a valid URL.',
      'The product code is required and must be 4 characters in length containing only the characters A-Z, a-z, 0-9, and _.',
      'The developer code from the CHPL Product Number 8990 does not match the code of the declared developer 1722.',
      'The certified date code is required and must be 6 characters in length containing only the characters 0-9.',
      'The additional software code is required and must be 1 character in length containing only the characters 0 or 1.',
      'The ONC-ATL code is required and must be 2 characters in length containing only the characters 0-9.',
      'The ICS code is required and must be 2 characters in length with a value between 00-99. If you have exceeded the maximum inheritance level of 99, please contact the CHPL team for further assistance.',
      'The Edition code is required and must be 2 characters in length containing only the characters 0-9.',
      'The \'Accessibility Certified\' value is \'false\' but 1 Accessibility Standard(s) were found.',
      'Testing Lab is required but not found.',
      'No certification date was found.',
      'Applicable criteria is required for each QMS Standard listed.',
      'A certification edition is required for the listing.',
      'The ONC-ACB test� is not valid.',
    ],
    expectedWarnings: [
      'An unrecognized character was found for ACB Certification ID',
      'An unrecognized character was found for ACB Name'
    ],
  },
  {
      listingId: '15.02.04.2701.REQ1.12.00.1.200620',
      expectedErrors: [
      'The unique id indicates the product does have additional software but none is specified in the upload file.',
      'The ICS value is \'true\' which means this listing has inherited properties. It is required that at least one parent from which the listing inherits be provided.',
      'The \'Accessibility Certified\' value is \'true\' but 0 Accessibility Standard(s) were found.',
      'Test procedures are required for certification criteria 170.315 (g)(4).',
      'Testing Lab is required but not found.',
      'QMS Standard(s) are required.',
      'Applicable criteria is required for each QMS Standard listed.',
      'Accessibility Standard(s) are required.',
    ],
    expectedWarnings: [
    ],
  },
  {
      listingId: '15.02.04.2701.ICS1.12.00.1.200620',
      expectedErrors: [
      'The unique id indicates the product does not have ICS but the value for Inherited Certification Status is true.',
      'No listing was found with the unique ID \'CHP-00000\'. ICS parent listings must reference existing listings in the CHPL.',
    ],
    expectedWarnings: [
    ],
  },  
];

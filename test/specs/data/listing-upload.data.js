const listings = [{
  chplProductNumber: '15.02.04.2701.MVL1.12.00.1.231020',
  fileName: 'test/resources/HTI-1-criteria.csv',
  expectedErrors: ['Certification 170.315 (b)(11) requires at least one test task.'],
  expectedWarnings: ['This listing has a product name of \'Compulink Healthcare Solutions\', but the developer Compulink Healthcare Solutions has a similarly named product \'Compulink Advantage\'. Please review the product selection during confirmation.'],
}, {
  chplProductNumber: '15.02.04.2701.MVL1.12.00.1.220620',
  fileName: 'test/resources/2015_MinimumViableListing.csv',
  expectedErrors: [],
  expectedWarnings: [
    'This listing has a product name of \'Compulink Healthcare Solutions\', but the developer Compulink Healthcare Solutions has a similarly named product \'Compulink Advantage\'. Please review the product selection during confirmation.',
    'No ONC-ATLs were provided. The ONC-ATL \'UL LLC\' was used based on the CHPL Product Number.',
  ],
}];

export default listings;

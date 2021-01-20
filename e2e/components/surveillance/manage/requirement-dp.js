module.exports = [
    {
        testName: 'Add Certified Capability requirement',
        type: 'Certified Capability',
        capabilitySelector: '#requirement-capability',
        capability: '170.315 (a)(1): Computerized Provider Order Entry (CPOE) - Medications',
    },
    {
        testName: 'Add Other requirement',
        type: 'Other Requirement',
        capabilitySelector: '#requirement-other',
        capability: 'Test Other requirement',
    },
    {
        testName: 'Add Transparency or Disclosure Requirement',
        type: 'Transparency or Disclosure Requirement',
        capabilitySelector: '#requirement-transparency',
        capability: '170.523 (k)(1)',
    },
];

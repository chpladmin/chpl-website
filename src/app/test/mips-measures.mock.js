const mipsMeasures = [{
    mipsDomain: { domain: 'EC' },
    requiredTestAbbr: 'RT1',
    requiredTest: 'Required Test 1: Something something',
    name: 'Doing a thing with stuff',
    criteriaSelectionRequired: false,
    allowedCriteria: [],
},{
    mipsDomain: { domain: 'EC' },
    requiredTestAbbr: 'RT10',
    requiredTest: 'Required Test 10: Something something',
    name: 'Doing another thing with stuff',
    criteriaSelectionRequired: false,
    allowedCriteria: [],
},{
    mipsDomain: { domain: 'EH' },
    requiredTestAbbr: 'RT3',
    requiredTest: 'Required Test 3: Something something',
    name: 'Doing a thing with stuff again',
    criteriaSelectionRequired: false,
    allowedCriteria: [],
}];

const mipsTypes = [{
    name: 'G1',
},{
    name: 'G2',
}];

const certifiedProductMipsMeasures = [{
    mipsMeasure: angular.copy(mipsMeasures[0]),
    mipsType: angular.copy(mipsTypes[0]),
    criteria: [],
},{
    mipsMeasure: angular.copy(mipsMeasures[1]),
    mipsType: angular.copy(mipsTypes[1]),
    criteria: [],
},{
    mipsMeasure: angular.copy(mipsMeasures[2]),
    mipsType: angular.copy(mipsTypes[0]),
    criteria: [],
}];

export {mipsMeasures, mipsTypes, certifiedProductMipsMeasures };

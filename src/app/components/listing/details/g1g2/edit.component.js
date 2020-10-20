export const G1G2EditComponent = {
    templateUrl: 'chpl.components/listing/details/g1g2/edit.html',
    bindings: {
        measures: '<',
        resources: '<',
        onChange: '&',
    },
    controller: class G1G2EditComponent {
        constructor ($log) {
            'ngInject';
            this.$log = $log;
            this.addingItem = {
                mipsMeasures: false,
            };
            this.newItem = {
                mipsMeasures: {},
            };
            this.allowedMeasures = [];
        }

        $onChanges (changes) {
            if (changes.measures && changes.measures.currentValue) {
                this.measures = changes.measures.currentValue
                    .map(m => m)
                    .sort((a, b) => this.measureSort(a, b));
            }
            if (changes.resources && changes.resources.currentValue) {
                this.allMeasures = changes.resources.currentValue.mipsMeasures
                    .map(m => m)
                    .sort((a, b) => this.measureSort(a, b));
                this.allTests = changes.resources.currentValue.mipsMeasures
                    .map(m => m.requiredTestAbbr)
                    .sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
                this.allTypes = changes.resources.currentValue.mipsTypes
                    .map(t => t)
                    .sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
            }
            if (!this.measures) {
                this.fakeData();
            }
        }

        fakeData () {
            const mipsMeasures = [{
                mipsDomain: { domain: 'EC' },
                requiredTestAbbr: 'RT1',
                requiredTest: 'Required Test 1: Something something 1',
                name: 'Doing a thing with stuff',
                criteriaSelectionRequired: false,
                allowedCriteria: [],
            },{
                mipsDomain: { domain: 'EC' },
                requiredTestAbbr: 'RT10',
                requiredTest: 'Required Test 10: Something another something',
                name: 'Doing another thing with stuff',
                criteriaSelectionRequired: false,
                allowedCriteria: [],
            },{
                mipsDomain: { domain: 'EH' },
                requiredTestAbbr: 'RT3',
                requiredTest: 'Required Test 3: Anything',
                name: 'Doing a thing with stuff again',
                criteriaSelectionRequired: false,
                allowedCriteria: [],
            }];
            const mipsTypes = [{
                name: 'G1',
            },{
                name: 'G2',
            }];

            let changes = {
                resources: {
                    currentValue: {
                        mipsMeasures: mipsMeasures,
                        mipsTypes: mipsTypes,
                    },
                },
                measures: {
                    currentValue: [{
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
                    }],
                },
            };
            this.$onChanges(changes);
        }

        measureSort (a, b) {
            if (!a.mipsType) {
                a = {mipsType: 0, mipsMeasure: a};
            }
            if (!b.mipsType) {
                b = {mipsType: 0, mipsMeasure: b};
            }
            let getNum = test => parseInt(test.substring(2, 10));
            return a.mipsType.name < b.mipsType.name ? -1 : a.mipsType.name > b.mipsType.name ? 1 :
                a.mipsMeasure.mipsDomain.domain < b.mipsMeasure.mipsDomain.domain ? -1 : a.mipsMeasure.mipsDomain.domain > b.mipsMeasure.mipsDomain.domain ? 1 :
                getNum(a.mipsMeasure.requiredTestAbbr) < getNum(b.mipsMeasure.requiredTestAbbr) ? -1 : getNum(a.mipsMeasure.requiredTestAbbr) > getNum(b.mipsMeasure.requiredTestAbbr) ? 1 :
                a.mipsMeasure.name < b.mipsMeasure.name ? -1 : a.mipsMeasure.name > b.mipsMeasure.name ? 1 :
                0;
        }

        update () {
            this.onChange({measures: this.measures});
        }

        updateAllowedMeasures () {
            this.allowedMeasures = this.allMeasures.filter(m => m.requiredTestAbbr === this.newItem['mipsMeasures'].selectedTestAbbr);
        }

        // item list
        cancelNewItem (type) {
            this.newItem[type] = {};
            this.addingItem[type] = false;
            this.allowedMeasures = [];
        }

        removeItem (type, item) {
            switch (type) {
            case 'mipsMeasures':
                this.measures = this.measures
                    .filter(m => !(m.mipsType.name === item.mipsType.name
                                   && m.mipsMeasure.mipsDomain.domain === item.mipsMeasure.mipsDomain.domain
                                   && m.mipsMeasure.requiredTestAbbr === item.mipsMeasure.requiredTestAbbr));
                break;
            default:
                this.$log.error('remove', type, item);
            }
            this.update();
        }

        saveNewItem (type) {
            switch (type) {
            case 'mipsMeasures':
                this.measures.push({
                    mipsMeasure: this.newItem[type].measure,
                    mipsType: this.allTypes.filter(t => t.name === this.newItem[type].typeName)[0],
                    criteria: this.newItem[type].criteria,
                });
                break;
            default:
                this.$log.error('add', type);
            }
            this.cancelNewItem(type);
            this.update();
        }
    },
};

angular
    .module('chpl.components')
    .component('chplG1g2Edit', G1G2EditComponent);

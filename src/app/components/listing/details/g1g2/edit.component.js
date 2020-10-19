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
                mipsMeasures: undefined,
            };
        }

        $onChanges (changes) {
            if (changes.measures) {
                this.measures = changes.measures.currentValue
                    .map(m => m)
                    .sort((a, b) => this.measureSort(a, b));
            }
            if (changes.resources) {
                this.allMeasures = changes.resources.currentValue.mipsMeasures
                    .map(m => m)
                    .sort((a, b) => this.measureSort(a, b));
                this.allTests = changes.resources.currentValue.mipsMeasures
                    .map(m => m.requiredTestAbbr)
                    .sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
                this.allTypes = changes.resources.currentValue.mipsTypes
                    .map(t => t.name)
                    .sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
            }
        }

        filteredMeasures () {
            return this.allMeasures.filter(m => m.requiredTestAbbr === this.newItem['mipsMeasures'].selectedTestAbbr);
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

        // item list
        cancelNewItem (type) {
            this.newItem[type] = undefined;
            this.addingItem[type] = false;
        }

        removeItem (type, item) {
            switch (type) {
            case 'mipsMeasures':
                this.measures = this.measures
                    .filter(m => !(m.mipsType.name === item.mipsType.name
                                   && m.mipsMeasure.mipsDomain === item.mipsMeasure.mipsDomain
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
                    mipsType: this.mipsTypes.filter(t => t.name === this.newItem[type].mipsType)[0],
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

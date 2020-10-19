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
        }

        $onChanges (changes) {
            if (changes.measures) {
                this.measures = changes.measures.currentValue
                    .map(m => m)
                    .sort((a, b) => measureSort);
            }
            if (changes.resources) {
                this.allMeasures = changes.resources.currentValue.measures
                    .map(m => m)
                    .sort((a, b) => measureSort);
            }
        }

        measureSort(a, b) {
            return 0;
            /*
            return a.g < b.g ? -1 : a.g > b.g ? 1 :
                a.domain < b.domain ? -1 : a.domain > b.domain ? 1 :
                a.test < b.test ? -1 : a.test > b.test ? 1 :
                a.name < b.name ? -1 : a.name > b.name ? 1 :
                0;
                */
        }

        update () {
            this.onChange({measures: this.measures});
        }
    },
};

angular
    .module('chpl.components')
    .component('chplG1g2Edit', G1G2EditComponent);

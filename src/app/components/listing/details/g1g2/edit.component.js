export const G1G2EditComponent = {
    templateUrl: 'chpl.components/listing/details/g1g2/edit.html',
    bindings: {
        measures: '<',
        onChange: '&',
    },
    controller: class G1G2EditComponent {
        constructor ($log) {
            'ngInject';
            this.$log = $log;
        }

        $onChanges (changes) {
            if (changes.measures) {
                this.measures = changes.measures.currentValue.map(m => m);
            }
        }

        update () {
            this.onChange({measures: this.measures});
        }
    },
};

angular
    .module('chpl.components')
    .component('chplG1g2Edit', G1G2EditComponent);

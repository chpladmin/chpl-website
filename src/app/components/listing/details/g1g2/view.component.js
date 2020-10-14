export const G1G2ViewComponent = {
    templateUrl: 'chpl.components/listing/details/g1g2/view.html',
    bindings: {
        measures: '<',
    },
    controller: class G1G2ViewComponent {
        constructor ($log) {
            'ngInject';
            this.$log = $log;
        }

        $onChanges (changes) {
            if (changes.measures) {
                this.measures = changes.measures.currentValue.map(m => m);
            }
        }
    },
};

angular
    .module('chpl.components')
    .component('chplG1g2View', G1G2ViewComponent);

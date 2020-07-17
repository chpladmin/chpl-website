export const FilterMultipleComponent = {
    templateUrl: 'chpl.components/filter/filter-multiple.html',
    bindings: {
        items: '<',
    },
    controller: class FilterMultipleComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
            this.title = 'Certification Status';
        }

        $onChanges (changes) {
            if (changes.items) {
                this.items = angular.copy(changes.items.currentValue);
            }
        }
    },
}

angular.module('chpl.components')
    .component('chplFilterMultiple', FilterMultipleComponent);

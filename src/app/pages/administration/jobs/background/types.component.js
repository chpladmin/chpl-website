export const JobsBackgroundTypesComponent = {
    templateUrl: 'chpl.administration/jobs/background/types.html',
    bindings: {
        types: '<',
    },
    controller: class JobsBackgroundTypesComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
        }

        $onChanges (changes) {
            if (changes.types) {
                this.types = angular.copy(changes.types.currentValue);
            }
        }
    },
}

angular.module('chpl.administration')
    .component('chplJobsBackgroundTypes', JobsBackgroundTypesComponent);

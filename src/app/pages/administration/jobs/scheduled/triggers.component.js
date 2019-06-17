export const JobsScheduledTriggersComponent = {
    templateUrl: 'chpl.administration/jobs/scheduled/triggers.html',
    bindings: {
        triggers: '<',
        takeAction: '&',
    },
    controller: class JobsScheduledTriggersComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
            this.mode = 'view';
        }

        $onChanges (changes) {
            if (changes.triggers) {
                this.triggers = angular.copy(changes.triggers.currentValue);
            }
        }

        cancel () {
            this.takeAction('cancel');
        }
    },
}

angular.module('chpl.administration')
    .component('chplJobsScheduledTriggers', JobsScheduledTriggersComponent);

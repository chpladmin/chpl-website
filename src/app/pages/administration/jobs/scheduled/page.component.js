export const JobsScheduledPageComponent = {
    templateUrl: 'chpl.administration/jobs/scheduled/page.html',
    bindings: {
        triggers: '<',
        types: '<',
    },
    controller: class JobsScheduledPageComponent {
        constructor ($log, networkService) {
            'ngInject'
            this.$log = $log;
            this.networkService = networkService;
            this.mode = 'view';
        }

        $onChanges (changes) {
            if (changes.triggers && changes.triggers.currentValue) {
                this.triggers = angular.copy(changes.triggers.currentValue.results);
            }
            if (changes.types && changes.types.currentValue) {
                this.types = angular.copy(changes.types.currentValue.results);
            }
        }

        takeTriggerAction (trigger, action) {
            this.$log.info(trigger, action);
        }

        takeTypeAction (type, action) {
            this.$log.info(type, action);
        }

        cancel () {
            this.mode = 'view';
        }
    },
}

angular.module('chpl.administration')
    .component('chplJobsScheduledPage', JobsScheduledPageComponent);

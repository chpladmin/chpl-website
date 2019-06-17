export const JobsScheduledPageComponent = {
    templateUrl: 'chpl.administration/jobs/scheduled/page.html',
    bindings: {
        acbs: '<',
        jobs: '<',
        triggers: '<',
    },
    controller: class JobsScheduledPageComponent {
        constructor ($log, networkService) {
            'ngInject'
            this.$log = $log;
            this.networkService = networkService;
            this.mode = 'view';
        }

        $onChanges (changes) {
            if (changes.acbs && changes.acbs.currentValue) {
                this.acbs = angular.copy(changes.acbs.currentValue.acbs);
            }
            if (changes.jobs && changes.jobs.currentValue) {
                this.jobs = angular.copy(changes.jobs.currentValue.results);
            }
            if (changes.triggers && changes.triggers.currentValue) {
                this.triggers = angular.copy(changes.triggers.currentValue.results);
            }
        }

        takeTriggerAction (action, data) {
            this.activeTrigger = data;
            this.mode = 'editTrigger';
        }

        takeJobAction (action, data) {
            switch (action) {
            case 'edit':
                this.activeJob = data;
                this.mode = 'editJob';
                break;
            case 'scheduleOneTime':
                this.activeJob = data;
                this.mode = 'scheduleTrigger';
                this.isRecurring = false;
                break;
            case 'scheduleRecurring':
                this.activeJob = data;
                this.activeTrigger = {};
                this.mode = 'scheduleTrigger';
                this.isRecurring = true;
                break;
                //no default
            }
        }

        cancel () {
            this.mode = 'view';
            this.activeJob = undefined;
            this.activeTrigger = undefined;
        }

        saveJob (job) {
            this.$log.info('saveJob', job);
        }

        saveTrigger (trigger) {
            this.$log.info('saveTrigger', trigger);
        }
    },
}

angular.module('chpl.administration')
    .component('chplJobsScheduledPage', JobsScheduledPageComponent);

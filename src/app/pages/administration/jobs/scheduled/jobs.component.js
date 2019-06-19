export const JobsScheduledJobsComponent = {
    templateUrl: 'chpl.administration/jobs/scheduled/jobs.html',
    bindings: {
        jobs: '<',
        takeAction: '&',
    },
    controller: class JobsScheduledJobsComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
            this.hideAcb = true;
            this.showJob = false;
        }

        $onChanges (changes) {
            if (changes.jobs) {
                this.jobs = angular.copy(changes.jobs.currentValue);
            }
            if (this.jobs) {
                this.jobs.forEach(t => {
                    this.hideAcb = this.hideAcb && !!t.jobDataMap && !!t.jobDataMap.acbSpecific;
                    this.showJob = this.showJob || t.group === 'systemJobs';
                });
            }
        }

        editJob (job) {
            this.takeAction({
                action: 'edit',
                data: job,
            });
        }

        scheduleOneTimeJob (job) {
            this.takeAction({
                action: 'scheduleOneTime',
                data: job,
            });
        }

        scheduleRecurringJob (job) {
            this.takeAction({
                action: 'scheduleRecurring',
                data: job,
            });
        }
    },
}

angular.module('chpl.administration')
    .component('chplJobsScheduledJobs', JobsScheduledJobsComponent);

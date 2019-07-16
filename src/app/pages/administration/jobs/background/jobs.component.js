export const JobsBackgroundJobsComponent = {
    templateUrl: 'chpl.administration/jobs/background/jobs.html',
    bindings: {
        jobs: '<',
    },
    controller: class JobsBackgroundJobsComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
        }

        $onChanges (changes) {
            if (changes.jobs) {
                this.jobs = changes.jobs.currentValue.map(job => {
                    job.jobName = job.type.name;
                    job.fullName = job.user.fullName;
                    job.complete = job.status.percentComplete;
                    return job;
                });
            }
        }
    },
}

angular.module('chpl.administration')
    .component('chplJobsBackgroundJobs', JobsBackgroundJobsComponent);

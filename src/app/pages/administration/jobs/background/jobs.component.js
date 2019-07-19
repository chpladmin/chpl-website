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
            if (changes.jobs && changes.jobs.currentValue) {
                this.jobs = changes.jobs.currentValue.map(job => {
                    job.jobName = job.type.name;
                    job.fullName = job.user.fullName;
                    return job;
                });
            }
        }
    },
}

angular.module('chpl.administration')
    .component('chplJobsBackgroundJobs', JobsBackgroundJobsComponent);

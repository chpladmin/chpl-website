export const JobsScheduledJobComponent = {
    templateUrl: 'chpl.administration/jobs/scheduled/job.html',
    bindings: {
        job: '<',
        onSave: '&',
        onCancel: '&',
    },
    controller: class JobsScheduledJobComponent {
        constructor ($log) {
            'ngInject';
            this.$log = $log;
            this.newItem = {};
        }

        $onChanges (changes) {
            if (changes.job) {
                this.job = angular.copy(changes.job.currentValue);
            }
        }

        save () {
            this.onSave({
                job: this.job,
            });
        }

        cancel () {
            this.onCancel();
        }

        addNewItem (item) {
            const key = item.split('-')[0];
            const vals = this.job.jobDataMap[key] ? this.job.jobDataMap[key].split(',') : [];
            vals.push(this.newItem[item]);
            this.newItem[item] = '';
            this.job.jobDataMap[key] = vals.join(',');
        }

        removeItem (item, value) {
            const key = item.split('-')[0];
            const vals = this.job.jobDataMap[key].split(',').filter(v => v !== value);
            this.job.jobDataMap[key] = vals.join(',');
        }
    },
};

angular.module('chpl.administration')
    .component('chplJobsScheduledJob', JobsScheduledJobComponent);

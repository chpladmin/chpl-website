export const JobsScheduledJobComponent = {
    templateUrl: 'chpl.administration/jobs/scheduled/job.html',
    bindings: {
        job: '<',
        onSave: '&',
        onCancel: '&',
    },
    controller: class JobsScheduledJobComponent {
        constructor ($log, SPLIT_COMMA) {
            'ngInject'
            this.$log = $log;
            this.SPLIT_COMMA = SPLIT_COMMA;
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
            const vals = this.job.jobDataMap[key] ? this.job.jobDataMap[key].split(this.SPLIT_COMMA) : [];
            vals.push(this.newItem[item]);
            this.newItem[item] = '';
            this.job.jobDataMap[key] = vals.join(this.SPLIT_COMMA);
        }

        removeItem (item, value) {
            const key = item.split('-')[0];
            const vals = this.job.jobDataMap[key].split(this.SPLIT_COMMA).filter(v => v !== value);
            this.job.jobDataMap[key] = vals.join(this.SPLIT_COMMA);
        }
    },
}

angular.module('chpl.administration')
    .component('chplJobsScheduledJob', JobsScheduledJobComponent);

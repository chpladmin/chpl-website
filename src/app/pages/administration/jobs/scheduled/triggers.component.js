export const JobsScheduledTriggersComponent = {
    templateUrl: 'chpl.administration/jobs/scheduled/triggers.html',
    bindings: {
        scheduledSystemJobs: '<',
        takeAction: '&',
        triggers: '<',
    },
    controller: class JobsScheduledTriggersComponent {
        constructor ($log, SPLIT_PRIMARY) {
            'ngInject'
            this.$log = $log;
            this.SPLIT_PRIMARY = SPLIT_PRIMARY
            this.mode = 'view';
        }

        $onChanges (changes) {
            if (changes.triggers) {
                this.triggers = angular.copy(changes.triggers.currentValue);
            }
            if (this.triggers && this.triggers.length > 0) {
                this.triggers = this.triggers.map(trigger => {
                    trigger.details = ['Schedule: ' + trigger.cronSchedule, 'Type: ' + trigger.job.name];
                    if (trigger.acb) {
                        let acbs = trigger.acb.split(this.SPLIT_PRIMARY);
                        trigger.details.push('ONC-ACB' + (acbs.length !== 1 ? 's: ' : ': ') + acbs.join(', '));
                    }
                    return trigger;
                });
            }
            if (changes.scheduledSystemJobs) {
                this.scheduledSystemJobs = angular.copy(changes.scheduledSystemJobs.currentValue);
            }
        }

        editTrigger (trigger) {
            this.takeAction({
                action: 'edit',
                data: trigger,
            });
        }
    },
}

angular.module('chpl.administration')
    .component('chplJobsScheduledTriggers', JobsScheduledTriggersComponent);

export const JobsScheduledTriggersComponent = {
    templateUrl: 'chpl.administration/jobs/scheduled/triggers.html',
    bindings: {
        scheduledSystemJobs: '<',
        takeAction: '&',
        triggers: '<',
        acbs: '<',
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
            if (changes.acbs) {
                this.acbs = angular.copy(changes.acbs.currentValue);
            }
            if (this.triggers && this.triggers.length > 0) {
                this.triggers = this.triggers.map(trigger => {
                    trigger.details = ['Schedule: ' + trigger.cronSchedule, 'Type: ' + trigger.job.name];
                    if (trigger.acb) {
                        let acbs = trigger.acb.split(',');
                        trigger.details.push('ONC-ACB' + (acbs.length !== 1 ? 's: ' : ': ') + this._getAcbNamesCommaDelimited(acbs));
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

        _getAcb (acbId) {
            return this.acbs.find(acb => acb.id === acbId)
        }

        _getAcbNamesCommaDelimited (acbs) {
            return acbs.map(acbId => this._getAcb(parseInt(acbId, 10)).name).join(', ');
        }
    },
}

angular.module('chpl.administration')
    .component('chplJobsScheduledTriggers', JobsScheduledTriggersComponent);

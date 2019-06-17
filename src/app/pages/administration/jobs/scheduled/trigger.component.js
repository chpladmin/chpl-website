export const JobsScheduledTriggerComponent = {
    templateUrl: 'chpl.administration/jobs/scheduled/trigger.html',
    bindings: {
        job: '<',
        trigger: '<',
        recurring: '<',
        onSave: '&',
        onCancel: '&',
    },
    controller: class JobsScheduledJobComponent {
        constructor ($interval, $log, SPLIT_PRIMARY) {
            'ngInject'
            this.$interval = $interval;
            this.$log = $log;
            this.SPLIT_PRIMARY = SPLIT_PRIMARY;
            this.selectedDateTime = new Date();
            this.parameters = [];
        }

        $onInit () {
            let that = this;
            let tick = () => {
                that.now = Date.now();
            }
            tick();
            this.$interval(tick, 1000);
        }

        $onChanges (changes) {
            if (changes.job) {
                this.job = angular.copy(changes.job.currentValue);
            }
            if (changes.trigger) {
                this.trigger = angular.copy(changes.trigger.currentValue);
            }
            if (changes.recurring) {
                this.recurring = angular.copy(changes.recurring.currentValue);
            }
            if (this.trigger) {
                if (!this.trigger.cronSchedule) {
                    this.trigger.cronSchedule = this._getDefaultCron();
                }
                if (this.trigger.acb) {
                    this.selectedAcb = this.trigger.acb.split(this.SPLIT_PRIMARY).map(acb => ({name: acb}));
                }
                if (!this.job && this.trigger.job) {
                    this.job = this.trigger.job;
                }
            }
            if (this.job) {
                if (this.job.jobDataMap.parameters) {
                    this.parameters = JSON.parse(this.job.jobDataMap.parameters);
                }
                this.schConfig = this._getScheduleConfig();
            }
        }

        save () {
            let trigger = {
                job: this.job,
            };
            if (this.recurring) {
                trigger.trigger = this.trigger;
            } else {
                trigger.runDateMillis = this.selectedDateTime.getTime();
            }
            this.onSave({
                trigger: trigger,
            });
        }

        cancel () {
            this.onCancel();
        }

        _getDefaultCron () {
            let ret = '';
            if (this.trigger.job && this.trigger.job.frequency) {
                switch (this.trigger.job.frequency) {
                case 'MONTHLY':
                    //first day of every month 4am UTC
                    ret = '0 0 4 1 1/1 ? *';
                    break;
                case 'WEEKLY':
                    //every monday at 3am UTC
                    ret = '0 0 3 ? * MON *';
                    break;
                case 'HOURLY':
                    //every hour at 30 minutes past the hour
                    ret = '0 30 0/1 1/1 * ? *';
                    break;
                default:
                    //daily at 4am UTC
                    ret = '0 0 4 1/1 * ? *';
                    break;
                }
            }
            return ret;
        }

        _getScheduleConfig () {
            return Object.assign(
                this._getTimingRestrictions(this.job),
                {
                    formInputClass: '',
                    formSelectClass: '',
                    formRadioClass: '',
                    formCheckboxClass: '',
                    //use24HourTime: true,
                });
        }

        _getTimingRestrictions (job) {
            let ret = {
                hideSeconds: true,
                hideMinutesTab: false,
                hideHourlyTab: false,
                hideDailyTab: false,
            };
            if (job && job.frequency) {
                switch (job.frequency) {
                case 'WEEKLY':
                    ret.hideDailyTab = true;
                    //falls through
                case 'DAILY':
                    ret.hideHourlyTab = true;
                    //falls through
                case 'HOURLY':
                    ret.hideMinutesTab = true;
                    //no default
                }
            }
            return ret;
        }
    },
}

angular.module('chpl.administration')
    .component('chplJobsScheduledTrigger', JobsScheduledTriggerComponent);

export const JobsScheduledPageComponent = {
    templateUrl: 'chpl.administration/jobs/scheduled/page.html',
    bindings: {
        acbs: '<',
        jobs: '<',
        triggers: '<',
    },
    controller: class JobsScheduledPageComponent {
        constructor ($anchorScroll, $log, networkService, toaster) {
            'ngInject'
            this.$anchorScroll = $anchorScroll;
            this.$log = $log;
            this.networkService = networkService;
            this.toaster = toaster;
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
            this.isRecurring = true;
        }

        takeJobAction (action, data) {
            switch (action) {
            case 'edit':
                this.activeJob = data;
                this.mode = 'editJob';
                break;
            case 'scheduleOneTime':
                this.activeTrigger = {
                    job: data,
                }
                this.mode = 'editTrigger';
                this.isRecurring = false;
                break;
            case 'scheduleRecurring':
                this.activeTrigger = {
                    job: data,
                };
                this.mode = 'editTrigger';
                this.isRecurring = true;
                break;
                //no default
            }
        }

        cancel () {
            this.mode = 'view';
            this.errorMessage = undefined;
            this.activeJob = undefined;
            this.activeTrigger = undefined;
        }

        saveJob (job) {
            let that = this;
            this.networkService.updateJob(job)
                .then(() => {
                    that.toaster.pop({
                        type: 'success',
                        title: 'Job updated',
                        body: 'Job has been updated',
                    });
                    that.refreshJobs();
                    that.cancel();
                }, error => {
                    that.errorMessage = error.data.error;
                    that.$anchorScroll();
                });
        }

        saveTrigger (trigger) {
            let that = this;
            if (this.isRecurring) {
                if (trigger.trigger.name) {
                    this.networkService.updateScheduleTrigger(trigger.trigger)
                        .then(() => {
                            that.toaster.pop({
                                type: 'success',
                                title: 'Job updated',
                                body: 'Recurring job updated',
                            });
                            that.cancel();
                            that.refreshTriggers();
                        }, error => {
                            that.errorMessage = error.data.error;
                            that.$anchorScroll();
                        });
                } else {
                    this.networkService.createScheduleTrigger(trigger.trigger)
                        .then(() => {
                            that.toaster.pop({
                                type: 'success',
                                title: 'Job created',
                                body: 'Recurring job scheduled',
                            });
                            that.cancel();
                            that.refreshTriggers();
                        }, error => {
                            that.errorMessage = error.data.error;
                            that.$anchorScroll();
                        });
                }
            } else {
                this.networkService.createScheduleOneTimeTrigger(trigger)
                    .then(() => {
                        that.toaster.pop({
                            type: 'success',
                            title: 'Job created',
                            body: 'One time job scheduled',
                        })
                        that.cancel();
                    }, error => {
                        that.errorMessage = error.data.error;
                        that.$anchorScroll();
                    });
            }
        }

        deleteTrigger (trigger) {
            let that = this;
            this.networkService.deleteScheduleTrigger(trigger)
                .then(() => {
                    that.toaster.pop({
                        type: 'success',
                        title: 'Job deleted',
                        body: 'Recurring job deleted',
                    });
                    that.cancel();
                    that.refreshTriggers();
                }, error => {
                    that.errorMessage = error.data.error;
                    that.$anchorScroll();
                });
        }

        refreshJobs () {
            let that = this;
            this.networkService.getScheduleJobs().then(results => that.jobs = results.results);
        }

        refreshTriggers () {
            let that = this;
            this.networkService.getScheduleTriggers().then(results => that.triggers = results.results);
        }
    },
}

angular.module('chpl.administration')
    .component('chplJobsScheduledPage', JobsScheduledPageComponent);

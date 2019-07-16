export const JobsBackgroundPageComponent = {
    templateUrl: 'chpl.administration/jobs/background/page.html',
    bindings: {
        types: '<',
    },
    controller: class JobsBackgroundPageComponent {
        constructor ($log, $scope, $timeout, networkService) {
            'ngInject'
            this.$log = $log;
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.networkService = networkService;
            this.JOB_REFRESH_TIMEOUT_INACTIVE = 30; // seconds
            this.JOB_REFRESH_TIMEOUT_ACTIVE = 5; // seconds
        }

        $onInit () {
            this.getJobs();
        }

        $onChanges (changes) {
            if (changes.types && changes.types.currentValue) {
                this.types = angular.copy(changes.types.currentValue);
            }
        }

        getJobs () {
            let that = this;
            that.networkService.getJobs().then(response => {
                that.jobs = response.results;
                let hasActive = that.jobs.reduce((hasActive, item) => hasActive || !item.status || item.status.status === 'In Progress', false);
                if (hasActive) {
                    that.jobRefresh = that.$timeout(function () {
                        that.getJobs();
                    }.bind(that), that.JOB_REFRESH_TIMEOUT_ACTIVE * 1000);
                } else {
                    that.jobRefresh = that.$timeout(function () {
                        that.getJobs();
                    }.bind(that), that.JOB_REFRESH_TIMEOUT_INACTIVE * 1000);
                }
            });
            this.$scope.$on('$destroy', () => {
                that.$timeout.cancel(that.jobRefresh);
            });
        }
    },
}

angular.module('chpl.administration')
    .component('chplJobsBackgroundPage', JobsBackgroundPageComponent);

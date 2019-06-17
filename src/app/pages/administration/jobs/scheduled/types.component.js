export const JobsScheduledTypesComponent = {
    templateUrl: 'chpl.administration/jobs/scheduled/types.html',
    bindings: {
        types: '<',
        takeAction: '&',
    },
    controller: class JobsScheduledTypesComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
            this.mode = 'view';
            this.hideAcb = true;
            this.showType = false;
        }

        $onChanges (changes) {
            if (changes.types) {
                this.types = angular.copy(changes.types.currentValue);
            }
            if (this.types) {
                this.types.forEach(t => {
                    this.hideAcb = this.hideAcb && !!t.jobDataMap && !!t.jobDataMap.acbSpecific;
                    this.showType = this.showType || t.group === 'systemJobs';
                });
            }
        }

        cancel () {
            this.takeAction('cancel');
        }
    },
}

angular.module('chpl.administration')
    .component('chplJobsScheduledTypes', JobsScheduledTypesComponent);

export const DeveloperMergeComponent = {
    templateUrl: 'chpl.administration/merge/developers.html',
    bindings: {
        developer: '<',
        developers: '<',
        onMerge: '&',
    },
    controller: class DeveloperMergeComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
        }

        $onChanges (changes) {
            if (changes.developer) {
                this.developer = angular.copy(changes.developer.currentValue);
            }
            if (changes.developers) {
                this.developers = (angular.copy(changes.developers.currentValue)).developers;
            }
            this.$log.info(this);
        }

        /*
         * Resolve changes
         */
        save () {
            this.$log.info('save', this);
        }
    },
}

angular.module('chpl.administration')
    .component('chplDeveloperMerge', DeveloperMergeComponent);

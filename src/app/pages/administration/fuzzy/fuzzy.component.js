export const FuzzyManagementComponent = {
    templateUrl: 'chpl.administration/fuzzy/fuzzy.html',
    bindings: {
        fuzzyTypes: '<',
    },
    controller: class FuzzyManagementComponent {
        constructor ($log, networkService) {
            'ngInject'
            this.$log = $log;
            this.networkService = networkService;
        }

        $onChanges (changes) {
            if (changes.fuzzy) {
                this.fuzzy = angular.copy(changes.fuzzy.currentValue);
            }
        }

        takeAction (data, action) {

        }
    },
}

angular.module('chpl.surveillance')
    .component('chplFuzzyManagement', FuzzyManagementComponent);

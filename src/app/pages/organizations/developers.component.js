export const DevelopersComponent = {
    templateUrl: 'chpl.organizations/developers.html',
    bindings: {
        action: '<',
        developer: '<',
        developers: '<',
        products: '<',
    },
    controller: class DevelopersComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
        }

        $onChanges (changes) {
            if (changes.action) {
                this.action = angular.copy(changes.action.currentValue);
            }
            if (changes.developer) {
                this.developer = angular.copy(changes.developer.currentValue);
            }
            if (changes.developers) {
                this.developers = (angular.copy(changes.developers.currentValue)).developers;
            }
            if (changes.products) {
                this.products = (angular.copy(changes.products.currentValue)).products;
            }
            this.$log.info(this);
        }
    },
}

angular.module('chpl.organizations')
    .component('chplDevelopers', DevelopersComponent);

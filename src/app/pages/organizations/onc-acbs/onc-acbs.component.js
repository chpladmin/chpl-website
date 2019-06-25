export const OncAcbsComponent = {
    templateUrl: 'chpl.organizations/onc-acbs/onc-acbs.html',
    bindings: {
        acb: '<',
        acbs: '<',
    },
    controller: class OncAcbsComponent {
        constructor ($log, $scope, $state, authService, networkService) {
            'ngInject'
            this.$log = $log;
            this.$scope = $scope;
            this.$state = $state;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
            this.acb = {};
        }

        $onInit () {
            let that = this;
            let loggedIn = this.$scope.$on('loggedIn', () => that.loadAcbs());
            this.$scope.$on('$destroy', loggedIn);
        }

        $onChanges (changes) {
            if (changes.acb) {
                this.acb = angular.copy(changes.acb.currentValue);
            }
            if (changes.acbs && changes.acbs.currentValue) {
                this.acbs = angular.copy(changes.acbs.currentValue.acbs);
            }
        }

        loadAcbs () {
            let that = this;
            this.networkService.getAcbs(this.hasAnyRole()).then(response => that.acbs = angular.copy(response.acbs));
        }
    },
}

angular.module('chpl.organizations')
    .component('chplOncAcbs', OncAcbsComponent);

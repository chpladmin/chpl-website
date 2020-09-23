export const SurveillanceComponent = {
    templateUrl: 'chpl.surveillance/surveillance.html',
    bindings: {
    },
    controller: class SurveillanceComponent {
        constructor ($log, $scope, $state, authService) {
            'ngInject'
            this.$log = $log;
            this.$scope = $scope;
            this.$state = $state;
            this.hasAnyRole = authService.hasAnyRole;
        }

        $onInit () {
            let that = this;
            let loggedIn = this.$scope.$on('loggedIn', () => that.$state.reload());
            this.$scope.$on('$destroy', loggedIn);
        }
    },
}

angular.module('chpl.surveillance')
    .component('chplSurveillance', SurveillanceComponent);

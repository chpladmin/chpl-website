export const SurveillanceComponent = {
    templateUrl: 'chpl.surveillance/surveillance.html',
    bindings: {
    },
    controller: class SurveillanceComponent {
        constructor ($log, $scope, $state, authService, featureFlags) {
            'ngInject'
            this.$log = $log;
            this.$scope = $scope;
            this.$state = $state;
            this.hasAnyRole = authService.hasAnyRole;
            this.isOn = featureFlags.isOn;
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

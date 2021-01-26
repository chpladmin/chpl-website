export const SvapsComponent = {
    templateUrl: 'chpl.administration/svaps.html',
    bindings: {
        svaps: '<',
    },
    controller: class SvapsComponent {
        constructor ($log) {
            'ngInject';
            this.$log = $log;
        }

        $onChanges (changes) {
        
        }
    },
};

angular.module('chpl.administration')
    .component('chplSvapsPage', SvapsComponent);

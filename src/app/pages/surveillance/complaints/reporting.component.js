export const ComplaintsReporting = {
    templateUrl: 'chpl.surveillance/complaints/reporting.html',
    bindings: {
    },
    controller: class ComplaintsReporting {
        constructor ($log) {
            'ngInject';
            this.$log = $log;
        }
    },
};

angular.module('chpl.surveillance')
    .component('chplComplaintsReporting', ComplaintsReporting);

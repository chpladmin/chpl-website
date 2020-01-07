export const SurveillanceManagementViewComponent = {
    templateUrl: 'chpl.surveillance/surveillance/components/view.html',
    bindings: {
        listing: '<',
        takeAction: '&',
    },
    controller: class SurveillanceManagementViewComponent {
        constructor ($log, authService, utilService) {
            'ngInject'
            this.$log = $log;
            this.certificationStatus = utilService.certificationStatus;
            this.canEdit = authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']);
        }

        $onChanges (changes) {
            if (changes.listing) {
                this.listing = angular.copy(changes.listing.currentValue);
            }
        }

        close () {
            this.takeAction({
                action: 'close',
                data: this.listing,
            });
        }
    },
}

angular.module('chpl.surveillance')
    .component('chplSurveillanceManagementView', SurveillanceManagementViewComponent);

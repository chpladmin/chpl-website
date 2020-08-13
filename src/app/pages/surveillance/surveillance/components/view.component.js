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
            this.hasAnyRole = authService.hasAnyRole;
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

        canEdit () {
            if (this.listing.certificationEdition.name === '2014') {
                return this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']);
            } else {
                return this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB']);
            }
        }
    },
}

angular.module('chpl.surveillance')
    .component('chplSurveillanceManagementView', SurveillanceManagementViewComponent);

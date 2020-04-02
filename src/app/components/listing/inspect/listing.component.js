export const InspectListingComponent = {
    templateUrl: 'chpl.components/listing/inspect/listing.html',
    bindings: {
        listing: '<',
        onChange: '&',
        resources: '<',
    },
    controller: class InspectListingController {
        constructor ($log, $uibModal, authService, utilService) {
            'ngInject'
            this.$log = $log;
            this.$uibModal = $uibModal;
            this.hasAnyRole = authService.hasAnyRole;
            this.ternaryFilter = utilService.ternaryFilter;
        }

        $onChanges (changes) {
            if (changes.listing) {
                this.listing = angular.copy(changes.listing.currentValue);
            }
            if (changes.resources) {
                this.resources = angular.copy(changes.resources.currentValue);
            }
        }

        editCertifiedProduct () {
            // if listing-edit is off, use this modal. If it's on, we'll need a new thing
            this.editModalInstance = this.$uibModal.open({
                templateUrl: 'chpl.admin/components/certifiedProduct/listing/edit.html',
                controller: 'EditCertifiedProductController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    activeCP: () => this.listing,
                    isAcbAdmin: () => this.hasAnyRole(['ROLE_ACB']),
                    isChplAdmin: () => this.hasAnyRole(['ROLE_ADMIN']),
                    resources: () => this.resources,
                    workType: () => 'confirm',
                },
            });
            this.editModalInstance.result.then(result => {
                this.listing = result;
                this.onChange({listing: result});
            });
        }

        checkQmsBoolean (qms) {
            if (qms === null) {
                return this.listing.qmsStandards.length > 0 ? 'True' : 'False';
            } else {
                return this.listing.hasQms ? 'True' : 'False';
            }
        }
    },
}

angular.module('chpl.components')
    .component('chplInspectListing', InspectListingComponent);

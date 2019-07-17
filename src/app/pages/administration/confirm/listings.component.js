export const ConfirmListingsComponent = {
    templateUrl: 'chpl.administration/confirm/listings.html',
    bindings: {
        developers: '<',
        onChange: '&',
        resources: '<',
    },
    controller: class ConfirmListingsComponent {
        constructor ($log, $uibModal, authService, networkService) {
            'ngInject'
            this.$log = $log;
            this.$uibModal = $uibModal;
            this.networkService = networkService;
            this.hasAnyRole = authService.hasAnyRole;
            this.massReject = {};
        }

        $onInit () {
            let that = this;
            this.networkService.getPendingListings().then(listings => {
                that.uploadingCps = listings;
            });
        }

        $onChanges (changes) {
            if (changes.developers) {
                this.developers = angular.copy(changes.developers.currentValue);
            }
            if (changes.resources) {
                this.resources = angular.copy(changes.resources.currentValue);
                if (Array.isArray(this.resources)) {
                    let resObj = {};
                    this.resources.forEach(item => {
                        Object.assign(resObj, item);
                    });
                    this.resources = resObj;
                    this.$log.info(this.resources);
                }
            }
        }

        getNumberOfListingsToReject () {
            var ret = 0;
            angular.forEach(this.massReject, value => {
                if (value) {
                    ret += 1;
                }
            });
            return ret;
        }

        inspectCp (cpId) {
            let that = this;

            this.modalInstance = this.$uibModal.open({
                templateUrl: 'chpl.admin/components/certifiedProduct/inspect/inspect.html',
                controller: 'InspectController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    developers: () => that.developers,
                    inspectingCp: () => that.networkService.getPendingListingById(cpId),
                    isAcbAdmin: () => that.hasAnyRole(['ROLE_ACB']),
                    isChplAdmin: () => that.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']),
                    resources: () => that.resources,
                },
                size: 'lg',
            });
            this.modalInstance.result.then(result => {
                if (result.status === 'confirmed' || result.status === 'rejected' || result.status === 'resolved') {
                    if (result.developerCreated) {
                        this.developers.push(result.developer);
                    }
                    this.clearPendingListing(cpId);
                    this.onChange();
                    if (result.status === 'resolved') {
                        this.uploadingListingsMessages = ['Product with ID: "' + result.objectId + '" has already been resolved by "' + result.contact.fullName + '"'];
                    }
                }
            });
        }

        massRejectPendingListings () {
            let that = this;
            var idsToReject = [];
            angular.forEach(this.massReject, (value, key) => {
                if (value) {
                    idsToReject.push(parseInt(key));
                    this.clearPendingListing(parseInt(key));
                    delete(this.massReject[key]);
                }
            });
            this.networkService.massRejectPendingListings(idsToReject)
                .then(() => {
                    that.onChange();
                }, error => {
                    that.onChange();
                    if (error.data.errors && error.data.errors.length > 0) {
                        that.uploadingListingsMessages = error.data.errors.map(error => 'Product with ID: "' + error.objectId + '" has already been resolved by "' + error.contact.fullName + '"');
                    }
                });
        }

        clearPendingListing (cpId) {
            this.uploadingCps = this.uploadingCps.filter(l => l.id !== cpId);
        }
    },
}

angular.module('chpl.administration')
    .component('chplConfirmListings', ConfirmListingsComponent);

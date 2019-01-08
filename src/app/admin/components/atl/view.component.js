export const AtlManagementComponent = {
    templateUrl: 'chpl.admin/components/atl/view.html',
    bindings: {
        atl: '<',
    },
    controller: class AtlManagementController {
        constructor ($log, $uibModal, authService) {
            'ngInject'
            this.$log = $log;
            this.$uibModal = $uibModal;
            this.authService = authService;
        }

        $onChanges (changes) {
            if (changes.atl) {
                this.atl = angular.copy(changes.atl.currentValue);
                this.workType = 'atl';
            }
        }

        $onInit () {
            this.isAtlAdmin = this.authService.hasAnyRole(['ROLE_ATL']);
            this.isChplAdmin = this.authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']);
            if (!this.workType) {
                this.workType = 'atl';
            }
        }

        createAtl () {
            const isChplAdmin = this.isChplAdmin;
            this.modalInstance = this.$uibModal.open({
                templateUrl: 'chpl.admin/components/atl/modal.html',
                controller: 'ModalAtlController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    atl: () => ({ }),
                    action: () => 'create',
                    isChplAdmin: () => isChplAdmin,
                },
            });
            this.modalInstance.result.then(result => { this.atl = angular.copy(result); });
        }

        editAtl (atl) {
            const isChplAdmin = this.isChplAdmin;
            this.modalInstance = this.$uibModal.open({
                templateUrl: 'chpl.admin/components/atl/modal.html',
                controller: 'ModalAtlController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    atl: () => atl,
                    action: () => 'edit',
                    isChplAdmin: () => isChplAdmin,
                },
            });
            this.modalInstance.result.then(result => { this.atl = angular.copy(result); });
        }
    },
}

angular.module('chpl.admin')
    .component('aiAtlManagement', AtlManagementComponent);

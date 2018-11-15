export const AcbManagementComponent = {
    templateUrl: 'chpl.admin/components/acb/acbManagement.html',
    bindings: {
        workType: '@',
        acb: '<',
    },
    controller: class AcbManagementController {
        constructor ($log, $uibModal, authService) {
            'ngInject'
            this.$log = $log;
            this.$uibModal = $uibModal;
            this.authService = authService;
        }

        $onChanges (changes) {
            if (changes.acb) {
                this.acb = angular.copy(changes.acb.currentValue);
            }
        }

        $onInit () {
            this.isAcbAdmin = this.authService.isAcbAdmin();
            this.isChplAdmin = this.authService.isChplAdmin();
            if (angular.isUndefined(this.workType)) {
                this.workType = 'acb';
            }
        }

        createAcb () {
            this.$log.debug(this.isChplAdmin);
            this.modalInstance = this.$uibModal.open({
                templateUrl: 'chpl.admin/components/acb/acbEdit.html',
                controller: 'EditAcbController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    acb: function () { return {}; },
                    action: function () { return 'create'; },
                    isChplAdmin: function () { return this.authService.isChplAdmin(); },
                },
            });
            this.modalInstance.result.then(result => { this.acb = angular.copy(result); });
        }

        editAcb (acb) {
            this.modalInstance = this.$uibModal.open({
                templateUrl: 'chpl.admin/components/acb/acbEdit.html',
                controller: 'EditAcbController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    acb: function () { return acb; },
                    action: function () { return 'edit'; },
                    isChplAdmin: function () { return this.isChplAdmin; },
                },
            });
            this.modalInstance.result.then(result => {
                if (result !== 'deleted') {
                    this.acb = angular.copy(result);
                } else {
                    this.acb = null;
                }
            });
        }
    },
}

angular.module('chpl.admin')
    .component('aiAcbManagement', AcbManagementComponent);

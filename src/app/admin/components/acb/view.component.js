export const AcbManagementComponent = {
    templateUrl: 'chpl.admin/components/acb/view.html',
    bindings: {
        acb: '<',
        onChange: '&',
    },
    controller: class AcbManagementController {
        constructor ($log, $state, $uibModal, authService, networkService, toaster) {
            'ngInject'
            this.$log = $log;
            this.$state = $state;
            this.$uibModal = $uibModal;
            this.authService = authService;
            this.networkService = networkService;
            this.toaster = toaster;
        }

        $onChanges (changes) {
            if (changes.acb) {
                this.acb = angular.copy(changes.acb.currentValue);
                this.workType = 'acb';
            }
            if (this.acb) {
                let that = this;
                this.networkService.getUsersAtAcb(this.acb.id)
                    .then(response => that.users = response.users);
            }
        }

        $onInit () {
            this.isAcbAdmin = this.authService.hasAnyRole(['ROLE_ACB']);
            this.isChplAdmin = this.authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']);
            if (!this.workType) {
                this.workType = 'acb';
            }
        }

        createAcb () {
            const isChplAdmin = this.isChplAdmin;
            this.modalInstance = this.$uibModal.open({
                templateUrl: 'chpl.admin/components/acb/modal.html',
                controller: 'ModalAcbController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    acb: () => ({ }),
                    action: () => 'create',
                    isChplAdmin: () => isChplAdmin,
                },
            });
            this.modalInstance.result.then(result => { this.acb = angular.copy(result); });
        }

        editAcb (acb) {
            const isChplAdmin = this.isChplAdmin;
            this.modalInstance = this.$uibModal.open({
                templateUrl: 'chpl.admin/components/acb/modal.html',
                controller: 'ModalAcbController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    acb: () => acb,
                    action: () => 'edit',
                    isChplAdmin: () => isChplAdmin,
                },
            });
            this.modalInstance.result.then(result => {
                this.acb = angular.copy(result);
                this.onChange({ acb: this.acb});
            });
        }

        takeAction (action, data) {
            let that = this;
            let invitation = {
                role: 'ROLE_ACB',
                emailAddress: data.email,
                permissionObjectId: this.acb.id,
            };
            switch (action) {
            case 'delete':
                this.networkService.removeUserFromAcb(data, that.acb.id)
                    .then(() => that.networkService.getUsersAtAcb(that.acb.id).then(response => that.users = response.users));
                break;
            case 'invite':
                this.networkService.inviteUser(invitation)
                    .then(() => that.toaster.pop({
                        type: 'success',
                        title: 'Email sent',
                        body: 'Email sent successfully to ' + data.email,
                    }));
                break;
            case 'refresh':
                this.networkService.getUsersAtAcb(this.acb.id).then(response => that.users = response.users);
                break;
            case 'reload':
                this.$state.reload();
                break;
                //no default
            }
        }
    },
}

angular.module('chpl.admin')
    .component('aiAcbManagement', AcbManagementComponent);

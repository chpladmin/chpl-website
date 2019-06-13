export const AtlManagementComponent = {
    templateUrl: 'chpl.admin/components/atl/view.html',
    bindings: {
        atl: '<',
        onChange: '&',
    },
    controller: class AtlManagementController {
        constructor ($log, $state, $uibModal, authService, networkService) {
            'ngInject'
            this.$log = $log;
            this.$state = $state;
            this.$uibModal = $uibModal;
            this.authService = authService;
            this.networkService = networkService;
        }

        $onChanges (changes) {
            if (changes.atl) {
                this.atl = angular.copy(changes.atl.currentValue);
                this.workType = 'atl';
            }
            if (this.atl) {
                let that = this;
                this.networkService.getUsersAtAtl(this.atl.id)
                    .then(response => that.users = response.users);
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
            this.modalInstance.result.then(result => {
                this.atl = angular.copy(result);
                this.onChange({ atl: this.atl});
            });
        }

        takeAction (action, data) {
            let that = this;
            switch (action) {
            case 'delete':
                this.networkService.removeUserFromAtl(data, that.atl.id)
                    .then(() => that.networkService.getUsersAtAtl(that.atl.id).then(response => that.users = response.users));
                break;
            case 'refresh':
                this.networkService.getUsersAtAtl(this.atl.id).then(response => that.users = response.users);
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
    .component('aiAtlManagement', AtlManagementComponent);

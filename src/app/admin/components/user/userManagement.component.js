(function () {
    'use strict';

    angular.module('chpl.admin').component('aiUserManagement', {
        templateUrl: 'chpl.admin/components/user/userManagement.html',
        controller: UserManagementController,
        bindings: {
            acbId: '@',
            atlId: '@',
        },
    });

    /** @ngInject */
    function UserManagementController ($log, $uibModal, networkService) {
        var ctrl = this;

        ctrl.updateUser = updateUser;
        ctrl.inviteUser = inviteUser;

        ////////////////////////////////////////////////////////////////////

        ctrl.$onInit = () => {
            _loadUsers();
        }

        function inviteUser () {
            ctrl.modalInstance = $uibModal.open({
                templateUrl: 'chpl.admin/components/user/edit.html',
                controller: 'EditUserController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    user: function () { return {}; },
                    action: function () { return 'invite'; },
                    acbId: function () { return ctrl.acbId; },
                    atlId: function () { return ctrl.atlId; },
                },
            });
        }

        function updateUser (user) {
            ctrl.modalInstance = $uibModal.open({
                templateUrl: 'chpl.admin/components/user/edit.html',
                controller: 'EditUserController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    user: function () { return user; },
                    action: function () { return 'edit'; },
                    acbId: function () { return ctrl.acbId; },
                    atlId: function () { return ctrl.atlId; },
                },
            });
            ctrl.modalInstance.result.then(function () {
                _loadUsers();
            });
        }

        ////////////////////////////////////////////////////////////////////

        function _loadUsers () {
            if (ctrl.acbId) {
                networkService.getUsersAtAcb(ctrl.acbId)
                    .then(function (response) {
                        ctrl.users = response.users;
                    });
            } else if (ctrl.atlId) {
                networkService.getUsersAtAtl(ctrl.atlId)
                    .then(function (response) {
                        ctrl.users = response.users;
                    });
            } else {
                networkService.getUsers()
                    .then(function (response) {
                        ctrl.users = response.users;
                    });
            }
        }
    }
})();

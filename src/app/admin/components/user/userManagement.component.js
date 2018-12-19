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

        ctrl.$onInit = function () {
            ctrl.roles = [];
            if (!ctrl.acbId && !ctrl.atlId) { // not managing acb or atl, managing entire CHPL
                ctrl.roles.push('ROLE_ADMIN');
                ctrl.roles.push('ROLE_ONC');
                ctrl.roles.push('ROLE_CMS_STAFF');
            }
            if (!ctrl.atlId) { // not managing ATL; either managing entire CHPL or single ACB
                ctrl.roles.push('ROLE_ACB');
            }
            if (!ctrl.acbId) { // not managing ACB; either managing entire CHPL or single ATL
                ctrl.roles.push('ROLE_ATL');
            }
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

(function () {
    'use strict';

    angular.module('chpl')
        .controller('ContactController', ContactController)
        .directive('aiContact', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'app/components/contact/contact.html',
                bindToController: {
                    contact: '=?',
                    errorMessages: '=?',
                    form: '=?',
                    formHorizontal: '=?',
                    isEditing: '=?',
                    isRequired: '=?',
                    showFormErrors: '=?'
                },
                scope: {},
                controllerAs: 'vm',
                controller: 'ContactController'
            };
        });

    /** @ngInject */
    function ContactController () {
        var vm = this;

        vm.updateErrors = updateErrors;
        vm.valuesRequired = valuesRequired;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.errorMessages = [];
            vm.updateErrors();
        }

        function updateErrors () {
            vm.errorMessages = [];
            if (vm.valuesRequired()) {
                if (!vm.contact || !vm.contact.firstName) { vm.errorMessages.push('First name is required'); }
                if (!vm.contact || !vm.contact.lastName) { vm.errorMessages.push('Last name is required'); }
                if (!vm.contact || !vm.contact.email) { vm.errorMessages.push('Email is required'); }
                if (!vm.contact || !vm.contact.phoneNumber) { vm.errorMessages.push('Phone number is required'); }
            }
        }

        function valuesRequired () {
            if (vm.isRequired) {
                return true;
            }
            if (vm.contact) {
                if (vm.contact.firstName ||
                    vm.contact.lastName ||
                    vm.contact.title ||
                    vm.contact.email ||
                    vm.contact.phoneNumber) {
                    return true;
                }
            }
            return false;
        }
    }
})();

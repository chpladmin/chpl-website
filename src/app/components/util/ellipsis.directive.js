(function () {
    'use strict';

    angular.module('chpl.components')
        .controller('EllipsisController', EllipsisController)
        .directive('aiEllipsis', aiEllipsis);

    function aiEllipsis () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'chpl.components/util/ellipsis.html',
            bindToController: {
                text: '@',
                maxLength: '@?',
                wordBoundaries: '@?',
            },
            scope: {},
            controllerAs: 'vm',
            controller: 'EllipsisController',
        };
    }

    /** @ngInclude */
    function EllipsisController () {
        var vm = this;

        ////////////////////////////////////////////////////////////////////

        this.$onInit = function () {
            vm.displayText = vm.text;
            vm.isShortened = false;
            if (vm.displayText.length > vm.maxLength) {
                vm.displayText = vm.text.substring(0, vm.maxLength);
                vm.isShortened = true;
                if (vm.wordBoundaries) {
                    var parts = vm.displayText.split(' ');
                    parts.splice(parts.length - 1, 1);
                    if (parts.length > 0) {
                        vm.displayText = parts.join(' ');
                    }
                }
            }
        }
    }
})();

(function () {
    'use strict';

    angular.module('chpl')
        .controller('EllipseController', EllipseController)
        .directive('aiEllipse', aiEllipse);

    function aiEllipse () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/components/util/ellipse.html',
            bindToController: {
                text: '@',
                maxLength: '@?',
                wordBoundaries: '@?'
            },
            scope: {},
            controllerAs: 'vm',
            controller: 'EllipseController'
        };
    }

    /** @ngInclude */
    function EllipseController () {
        var vm = this;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.displayText = vm.text;
            vm.isShortened = false;
            if (vm.displayText.length > vm.maxLength) {
                vm.displayText = vm.text.substring(0, vm.maxLength);
                vm.isShortened = true;
                if (vm.wordBoundaries) {
                    var parts = vm.displayText.split(' ');
                    parts.splice(parts.length - 1, 1);
                    if (parts.length > 0)
                        vm.displayText = parts.join(' ');
                }
            }
        }
    }
})();

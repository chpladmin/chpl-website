(function () {
    'use strict';
    angular.module('chpl.components')
        .directive('chplAddClassOnScroll', chplAddClassOnScroll);

    /** @ngInclude */
    function chplAddClassOnScroll ($log, $window) {
        return {
            restrict: 'A',
            scope: {
                offset: '@',
                scrollClass: '@',
            },
            link: function (scope, element) {
                angular.element($window).bind('scroll', function () {
                    if (this.pageYOffset >= parseInt(scope.offset, 10)) {
                        element.addClass(scope.scrollClass);
                    } else {
                        element.removeClass(scope.scrollClass);
                    }
                });
            },
        };
    }
})();

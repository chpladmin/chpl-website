(function () {
    'use strict';
    angular.module('chpl.components')
        .directive('chplHighlightCures', chplHighlightCures);

    /** @ngInclude */
    function chplHighlightCures () {
        return {
            restrict: 'A',
            require: 'ngModel',
            replace: true,
            scope: {
                ngModel: '=',
            },
            link: (scope, element) => {
                scope.$watch('ngModel', value => {
                    let html = value.replace('(Cures Update)', '<span class="cures-update">(Cures Update)</span>');
                    element.html(html);
                });
            },
        }
    }
})();

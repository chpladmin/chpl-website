(function () {
    'use strict';
    angular.module('chpl.components')
        .directive('aiMultiSort', aiMultiSort);

    /** @ngInclude */
    function aiMultiSort ($parse, $timeout, stConfig) {
        return {
            link: aiMultiSortLink,
            restrict: 'A',
            require: '^stTable',
        }

        function aiMultiSortLink (scope, element, attr, ctrl) {

            var predicate = angular.copy(attr.aiMultiSort);
            var classAscent = attr.stClassAscent || stConfig.sort.ascentClass;
            var classDescent = attr.stClassDescent || stConfig.sort.descentClass;
            var stateClasses = [classAscent, classDescent];
            var sortDefault;
            var descendingFirst = attr.stDescendingFirst !== undefined ? attr.stDescendingFirst : stConfig.sort.descendingFirst;
            var ascending = descendingFirst;
            var promise = null;
            var throttle = attr.stDelay || stConfig.sort.delay;

            if (attr.stSortDefault) {
                sortDefault = scope.$eval(attr.stSortDefault) !== undefined ? scope.$eval(attr.stSortDefault) : attr.stSortDefault;
            }

            //view --> table state
            function sort () {
                var func, sortStatus;
                sortStatus = ctrl.tableState().sort.predicate;

                if (!sortStatus) {
                    if (sortDefault) {
                        sortStatus = sortDefault;
                    } else {
                        sortStatus = [];
                    }
                }
                if (sortStatus.indexOf(predicate) === 0 || sortStatus.indexOf('-' + predicate) === 0) { // already first element in sort array; flip ascending direction and update
                    ascending = !ascending;
                    sortStatus[0] = (ascending ? '' : '-') + predicate;
                } else if (sortStatus.indexOf(predicate) > 0 || sortStatus.indexOf('-' + predicate) > 0) { // found somewhere in back; move to front, don't flip direction
                    sortStatus.splice(sortStatus.indexOf(predicate));
                    sortStatus.unshift((ascending ? '' : '-') + predicate);
                } else { // not found; flip ascending direction and unshift in
                    ascending = !ascending;
                    sortStatus.unshift((ascending ? '' : '-') + predicate);
                }
                element
                    .removeClass(stateClasses[ascending ? 1 : 0])
                    .addClass(stateClasses[ascending ? 0 : 1]);
                func = ctrl.sortBy.bind(ctrl, sortStatus);
                if (promise !== null) {
                    $timeout.cancel(promise);
                }
                if (throttle < 0) {
                    func();
                } else {
                    promise = $timeout(func, throttle);
                }
            }

            element.bind('click', function sortClick () {
                if (predicate) {
                    scope.$apply(sort);
                }
            });

            if (sortDefault) {
                sort();
            }

            //table state --> view
            scope.$watch(function () {
                return ctrl.tableState().sort;
            }, function (newValue) {
                var isPrimary = false;
                if (newValue.predicate && newValue.predicate.length > 0) {
                    if (newValue.predicate[0].indexOf(predicate) > -1) {
                        isPrimary = true;
                    }
                }
                if (isPrimary) {
                    element
                        .removeClass(stateClasses[ascending ? 1 : 0])
                        .addClass(stateClasses[ascending ? 0 : 1]);
                } else {
                    element
                        .removeClass(classAscent)
                        .removeClass(classDescent);
                }
            }, true);
        }
    }
})();

(function () {
    'use strict';
    angular.module('chpl')

        .directive('aiSurveillanceFilter', function () {
            return {
                restrict: 'E',
                require: '^stTable',
                scope: { },
                templateUrl: 'app/components/smart_table/aiSurveillanceFilter.html',
                link: function (scope, element, attr, table) {
                    scope.clearSurveillanceActivityFilter = clearSurveillanceActivityFilter;
                    scope.filterChanged = filterChanged;
                    var tableState;

                    activate();

                    ////////////////////////////////////////////////////////

                    function activate () {
                        tableState = table.tableState();
                        clearSurveillanceActivityFilter();
                    }

                    function clearSurveillanceActivityFilter () {
                        scope.query = {
                            surveillance: { }
                        };
                        filterChanged();
                    }

                    function filterChanged () {
                        if (tableState.search.predicateObject.surveillance) {
                            delete tableState.search.predicateObject.surveillance;
                        }

                        if (scope.query.hasHadSurveillance) {
                            var query = { anySurveillance: { } };
                            if (scope.query.hasHadSurveillance === 'never') {
                                query.anySurveillance.all = false;
                                query.anySurveillance.matchAll = true;
                                query.anySurveillance.hasOpenSurveillance = false;
                                query.anySurveillance.hasClosedSurveillance = false;
                                query.anySurveillance.hasOpenNonconformities = false;
                                query.anySurveillance.hasClosedNonconformities = false;
                            } else if (scope.query.hasHadSurveillance === 'has-had') {
                                if (angular.isUndefined(scope.query.surveillance.openSurveillance) &&
                                    angular.isUndefined(scope.query.surveillance.closedSurveillance) &&
                                    angular.isUndefined(scope.query.surveillance.openNonconformities) &&
                                    angular.isUndefined(scope.query.surveillance.closedNonconformities)) {
                                    query.anySurveillance.all = false;
                                    query.anySurveillance.matchAll = false;
                                    query.anySurveillance.hasOpenSurveillance = true;
                                    query.anySurveillance.hasClosedSurveillance = true;
                                    query.anySurveillance.hasOpenNonconformities = false;
                                    query.anySurveillance.hasClosedNonconformities = false;
                                } else {
                                    query.anySurveillance.all =
                                        !scope.query.surveillance.openSurveillance &&
                                        !scope.query.surveillance.closedSurveillance &&
                                        !scope.query.surveillance.openNonconformities &&
                                        !scope.query.surveillance.closedNonconformities;
                                    query.anySurveillance.matchAll = angular.copy(scope.query.surveillance.matchAll);
                                    query.anySurveillance.hasOpenSurveillance = angular.isDefined(scope.query.surveillance.openSurveillance) ? scope.query.surveillance.openSurveillance : false;
                                    query.anySurveillance.hasClosedSurveillance = angular.isDefined(scope.query.surveillance.closedSurveillance) ? scope.query.surveillance.closedSurveillance : false;
                                    query.anySurveillance.hasOpenNonconformities = angular.isDefined(scope.query.surveillance.openNonconformities) ? scope.query.surveillance.openNonconformities : false;
                                    query.anySurveillance.hasClosedNonconformities = angular.isDefined(scope.query.surveillance.closedNonconformities) ? scope.query.surveillance.closedNonconformities : false;
                                }
                            }
                            table.search(query, 'surveillance');
                        } else {
                            delete tableState.search.predicateObject.surveillance;
                            table.search();
                        }
                    }
                }
            }
        })
})();

;(function () {
    'use strict';

    angular.module('app.search')
        .controller('SearchController', ['$scope', '$log', '$location', '$localStorage', 'commonService', function ($scope, $log, $location, $localStorage, commonService) {
            var vm = this;

            vm.activate = activate;
            vm.addRefine = addRefine;
            vm.search = search;
            vm.unrefine = unrefine;

            vm.activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.activeSearch = false;
                vm.defaultRefine = { visibleOnCHPL: 'yes',
                                     certificationCriteria: [],
                                     cqms: []};
                if ($localStorage.refine) {
                    vm.refine = $localStorage.refine;
                } else {
                    vm.refine = angular.copy(vm.defaultRefine);
                }
            }

            function search () {
                if (vm.query.searchTermObject !== undefined) {
                    if (typeof(vm.query.searchTermObject) === 'string' && vm.query.searchTermObject.length > 0) {
                        vm.query.searchTermObject = {type: 'previous search', value: vm.query.searchTermObject};
                        vm.lookaheadSource.all.push(vm.query.searchTermObject);
                    }
                    vm.query.searchTerm = angular.copy(vm.query.searchTermObject.value);
                }
                if (vm.query.vendorObject !== undefined) {
                    if (typeof(vm.query.vendorObject) === 'string' && vm.query.vendorObject.length > 0) {
                        vm.query.vendorObject = {type: 'previous search', value: vm.query.vendorObject};
                        vm.lookaheadSource.vendors.push(vm.query.vendorObject);
                    }
                    vm.query.vendor = vm.query.vendorObject.value;
                }
                if (vm.query.productObject !== undefined) {
                    if (typeof(vm.query.productObject) === 'string' && vm.query.productObject.length > 0) {
                        vm.query.productObject = {type: 'previous search', value: vm.query.productObject};
                        vm.lookaheadSource.products.push(vm.query.productObject);
                    }
                    vm.query.product = vm.query.productObject.value;
                }
                $localStorage.lookaheadSource = vm.lookaheadSource;
                $localStorage.refine = vm.refine;
                commonService.search(vm.query)
                    .then(function (data) {
                        vm.hasDoneASearch = true;
                        vm.activeSearch = true;

                        $localStorage.searchResults = data;
                        $scope.searchResults = data.results;
                        $scope.displayedResults = [].concat($scope.searchResults);
                        $scope.resultCount = data.recordCount;
                    }, function (error) {
                        vm.errorResult();
                    });

                $localStorage.query = vm.query;
            }

            function addRefine () {
                switch (vm.refineType) {
                case 'vendor':
                    vm.query.vendorObject = vm.refine.vendor;
                    break;
                case 'product':
                    vm.query.productObject = vm.refine.product;
                    break;
                case 'certificationCriteria':
                    if (!vm.query.certificationCriteria) {
                        vm.query.certificationCriteria = [vm.refine.certificationCriteria];
                    } else if (vm.query.certificationCriteria.indexOf(vm.refine.certificationCriteria) === -1) {
                        vm.query.certificationCriteria.push(vm.refine.certificationCriteria)
                    }
                    break;
                case 'cqms':
                    if (!vm.query.cqms) {
                        vm.query.cqms = [vm.refine.cqms];
                    } else if (vm.query.cqms.indexOf(vm.refine.cqms) === -1) {
                        vm.query.cqms.push(vm.refine.cqms)
                    }
                    break;
                default:
                    vm.query[vm.refineType] = vm.refine[vm.refineType];
                    break;
                }
                vm.search();
            }

            function unrefine (key, cert) {
                switch (key) {
                case 'vendor':
                    delete(vm.query.vendor);
                    delete(vm.query.vendorObject);
                    delete(vm.refine.vendor);
                    break;
                case 'product':
                    delete(vm.query.product);
                    delete(vm.query.productObject);
                    delete(vm.refine.product);
                    break;
                case 'visibleOnCHPL':
                    vm.query.visibleOnCHPL = 'yes';
                    vm.refine.visibleOnCHPL = 'yes';
                    break;
                case 'certificationCriteria':
                    for (var i = 0; i < vm.query.certificationCriteria.length; i++) {
                        if (vm.query.certificationCriteria[i] === cert) {
                            vm.query.certificationCriteria.splice(i,1);
                            break;
                        }
                    }
                    break;
                case 'cqms':
                    for (var i = 0; i < vm.query.cqms.length; i++) {
                        if (vm.query.cqms[i] === cert) {
                            vm.query.cqms.splice(i,1);
                            break;
                        }
                    }
                    break;
                default:
                    delete(vm.query[key]);
                    delete(vm.refine[key]);
                    break;
                }
                vm.search();
            }

            $scope.searchResults = [];
            $scope.displayedResults = [];
            vm.lookaheadSource = {all: [], vendors: [], products: []};
            vm.hasDoneASearch = false;
            $scope.resultCount = 0;
            $scope.visiblePage = 1;
            vm.defaultQuery = {
                orderBy: 'vendor',
                sortDescending: false,
                pageNumber: 0,
                pageSize: '25',
                visibleOnCHPL: 'yes'
            };
            vm.query = angular.copy(vm.defaultQuery);

            if ($localStorage.searchResults) {
                $scope.searchResults = $localStorage.searchResults.results;
                $scope.displayedResults = [].concat($scope.searchResults);
                vm.hasDoneASearch = true;
                vm.activeSearch = true;
                $scope.resultCount = $localStorage.searchResults.recordCount;
            }

            if ($localStorage.query) {
                vm.query = $localStorage.query;
                $scope.visiblePage = vm.query.pageNumber + 1;
            }

            vm.populateSearchOptions = function () {
                commonService.getSearchOptions(false) // use 'true' in production, to hide retired CQMs & Certs
                    .then(function (options) {
                        vm.certs = options.certificationCriterionNumbers;
                        vm.cqms = options.cqmCriterionNumbers;
                        vm.editions = options.editions;
                        vm.classifications = options.productClassifications;
                        vm.practices = options.practiceTypeNames;
                        vm.certBodies = options.certBodyNames;
                        vm.certsNcqms = options.certificationCriterionNumbers.concat(options.cqmCriterionNumbers);
                        if ($localStorage.lookaheadSource && $localStorage.lookaheadSource.all.length > 0) {
                            $log.info('Restoring lookahead from localstorage');
                            vm.lookaheadSource = $localStorage.lookaheadSource;
                        } else {
                            for (var i = 0; i < options.vendorNames.length; i++) {
                                vm.lookaheadSource.all.push({type: 'vendor', value: options.vendorNames[i].name});
                                vm.lookaheadSource.vendors.push({type: 'vendor', value: options.vendorNames[i].name});
                            }
                            for (var i = 0; i < options.productNames.length; i++) {
                                vm.lookaheadSource.all.push({type: 'product', value: options.productNames[i].name});
                                vm.lookaheadSource.products.push({type: 'product', value: options.productNames[i].name});
                            }
                            $localStorage.lookaheadSource = $scope.lookaheadSource;
                        }
                    });
            };
            vm.populateSearchOptions();

            vm.compareIds = Object.create(null);
            vm.getCompareIds = function() {
                return vm.compareIds;
            };

            vm.toggleCompareId = function (anId) {
                if (anId in vm.compareIds) {
                    delete vm.compareIds[anId];
                } else {
                    vm.compareIds[anId] = true;
                }
            };
            $scope.toggleCompareId = vm.toggleCompareId;

            $scope.prepend = function (name) {
                if (name.substring(0,3) !== 'CMS') {
                    return 'NQF-' + name;
                } else {
                    return name;
                }
            };

            $scope.hasResults = function () {
                return $scope.searchResults !== undefined && $scope.searchResults.length > 0;
            };

            $scope.hasSearched = function () {
                return vm.hasDoneASearch;
            };

            $scope.browseAll = function () {
                $scope.clear();
                vm.search();
            };

            vm.errorResult = function () {
                delete $localStorage.searchResults;
                vm.hasDoneASearch = true;
                $scope.searchResults = [];
                $scope.displayedResults = [];
                $scope.visiblePage = 1;
                $scope.resultCount = 0;
                vm.compareIds = Object.create(null);
            };

            $scope.clear = function () {
                delete $localStorage.searchResults;
                delete $localStorage.query;
                delete $localStorage.lookaheadSource;
                delete $localStorage.refine;
                $scope.searchResults = [];
                $scope.displayedResults = [];
                $scope.visiblePage = 1;
                $scope.resultCount = 0;
                vm.compareIds = Object.create(null);
                vm.hasDoneASearch = false;
                vm.activeSearch = false;
                vm.query = angular.copy(vm.defaultQuery);
                vm.refineType = '';
                vm.refine = angular.copy(vm.defaultRefine);
                vm.searchForm.$setPristine();
            };

            $scope.compare = function () {
                var comparePath = '/compare/';
                for (var property in vm.compareIds) {
                    comparePath += property + '&';
                }
                comparePath = comparePath.substring(0, comparePath.length - 1);
                if (comparePath.indexOf('&') > 0) {
                    $location.path(comparePath);
                }
            };

            $scope.sort = function(header) {
                if (header === vm.query.orderBy) {
                    vm.query.sortDescending = !vm.query.sortDescending;
                } else {
                    vm.query.sortDescending = false;
                    vm.query.orderBy = header;
                }
                vm.search();
            }

            $scope.pageChanged = function (pageNumber) {
                vm.query.pageNumber = pageNumber - 1;
                vm.search();
            };
        }]);
})();

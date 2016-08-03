;(function () {
    'use strict';

    angular.module('app.search')
        .controller('SearchController', ['$scope', '$log', '$location', '$localStorage', 'commonService', 'CACHE_TIMEOUT', function ($scope, $log, $location, $localStorage, commonService, CACHE_TIMEOUT) {
            var vm = this;

            vm.addRefine = addRefine;
            vm.clear = clear;
            vm.clearFilters = clearFilters;
            vm.clearPreviouslyCompared = clearPreviouslyCompared;
            vm.clearPreviouslyViewed = clearPreviouslyViewed;
            vm.compare = compare;
            vm.populateSearchOptions = populateSearchOptions;
            vm.reloadResults = reloadResults;
            vm.restoreResults = restoreResults
            vm.search = search;
            vm.toggleCompare = toggleCompare;
            vm.truncButton = truncButton;
            vm.unrefine = unrefine;
            vm.viewProduct = viewProduct;
			vm.toggleCart = toggleCart;

            activate();

			// Execute after page is loaded so jquery can find elements
			angular.element(document).ready(function() {
                if (typeof chplCertIdWidgetLogin !== 'undefined') {
				    chplCertIdWidgetLogin.setup();
				    chplCertIdWidget.invokeGetCertificationId(null, null, false);
                }
			});

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.activeSearch = false;
                vm.resultCount = 0;
                vm.defaultRefine = {
                    certificationCriteria: [],
                    cqms: []
                };
                if ($localStorage.refine) {
                    vm.refine = $localStorage.refine;
                } else {
                    vm.refine = angular.copy(vm.defaultRefine);
                }
                vm.compareCps = [];
                if (!$localStorage.previouslyCompared) {
                    $localStorage.previouslyCompared = [];
                }
                vm.previouslyCompared = $localStorage.previouslyCompared;
                if (!$localStorage.previouslyViewed) {
                    $localStorage.previouslyViewed = [];
                }
                vm.previouslyViewed = $localStorage.previouslyViewed;
                $scope.searchResults = [];
                $scope.displayedResults = [];
                vm.lookaheadSource = {all: [], developers: [], products: []};
                vm.hasDoneASearch = false;
                $scope.visiblePage = 1;
                vm.boxes = {
                    compare: true,
                    prevComp: false,
                    prevView: false,
                };
                vm.defaultQuery = {
                    orderBy: 'developer',
                    sortDescending: false,
                    pageNumber: 0,
                    pageSize: '50'
                };
                vm.query = angular.copy(vm.defaultQuery);

                vm.restoreResults();
                vm.populateSearchOptions();

                if ($localStorage.clearResults) {
                    clear();
                    delete $localStorage.clearResults;
                }

                $scope.$on('ClearResults', function (event, args) {
                    clear();
                    delete $localStorage.clearResults;
                });
            }

            function addRefine () {
                switch (vm.refineType) {
                case 'developer':
                    vm.query.developerObject = vm.refine.developer;
                    if (vm.query.orderBy === 'developer') {
                        vm.query.orderBy = 'product';
                    }
                    break;
                case 'product':
                    vm.query.productObject = vm.refine.product;
                    if (vm.query.orderBy === 'developer' || vm.query.orderBy === 'product') {
                        vm.query.orderBy = 'version';
                    }
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
                vm.refineType = '';
                vm.search();
            }

            function clearFilters () {
                delete $localStorage.refine;
                delete $localStorage.query;

                var searchTerm, searchTermObject;
                if (vm.query.searchTerm) {
                    searchTerm = vm.query.searchTerm;
                }
                if (vm.query.searchTermObject) {
                    searchTermObject = vm.query.searchTermObject;
                }
                vm.refine = angular.copy(vm.defaultRefine);
                vm.query = angular.copy(vm.defaultQuery);
                if (searchTerm) {
                    vm.query.searchTerm = searchTerm;
                }
                if (searchTermObject) {
                    vm.query.searchTermObject = searchTermObject;
                }
                vm.search();
            }

            function clearPreviouslyCompared () {
                vm.previouslyCompared = [];
                $localStorage.previouslyCompared = [];
            }

            function clearPreviouslyViewed () {
                vm.previouslyViewed = [];
                $localStorage.previouslyViewed = [];
            }

            function compare () {
                var comparePath = '/compare/';
                for (var i = 0; i < vm.compareCps.length; i++) {
                    comparePath += vm.compareCps[i].id + '&';
                }
                comparePath = comparePath.substring(0, comparePath.length - 1);
                if (comparePath.indexOf('&') > 0) {
                    var prev = $localStorage.previouslyCompared;
                    var toAdd;
                    for (var i = 0; i < vm.compareCps.length; i++) {
                        toAdd = true;
                        for (var j = 0; j < prev.length; j++) {
                            if (prev[j].id === vm.compareCps[i].id) {
                                toAdd = false;
                            }
                        }
                        if (toAdd) {
                            prev.push(vm.compareCps[i]);
                        }
                    }
                    while (prev.length > 20) {
                        prev.shift();
                    }
                    $localStorage.previouslyCompared = prev;
                    $location.url(comparePath);
                }
            }

            function populateSearchOptions () {
                commonService.getSearchOptions(true) // use 'true' in production, to hide retired CQMs & Certs
                    .then(function (options) {
                        vm.certs = options.certificationCriterionNumbers;
                        vm.cqms = options.cqmCriterionNumbers;
                        vm.editions = options.editions;
                        vm.practices = options.practiceTypeNames;
                        vm.certBodies = options.certBodyNames;
                        vm.certificationStatuses = options.certificationStatuses;
                        for (var i = 0; i < vm.certificationStatuses.length; i++) {
                            if (vm.certificationStatuses[i].name === 'Pending') {
                                vm.certificationStatuses.splice(i,1);
                                break;
                            }
                        }
                        vm.certsNcqms = options.certificationCriterionNumbers.concat(options.cqmCriterionNumbers);
                        for (var i = 0; i < options.developerNames.length; i++) {
                            vm.lookaheadSource.all.push({type: 'developer', value: options.developerNames[i].name});
                            vm.lookaheadSource.developers.push({type: 'developer', value: options.developerNames[i].name});
                        }
                        for (var i = 0; i < options.productNames.length; i++) {
                            vm.lookaheadSource.all.push({type: 'product', value: options.productNames[i].name});
                            vm.lookaheadSource.products.push({type: 'product', value: options.productNames[i].name});
                        }
                        $localStorage.lookaheadSource = $scope.lookaheadSource;
                    });
            }

            function reloadResults () {
                $log.debug('reloading results');
                $localStorage.searchTimestamp = Math.floor((new Date()).getTime() / 1000 / 60);
                vm.restoreResults();
            }

            function restoreResults () {
                if ($localStorage.searchResults) {
                    var nowStamp = Math.floor((new Date()).getTime() / 1000 / 60);
                    var difference = nowStamp - $localStorage.searchTimestamp;
                    vm.pastTimeout = (difference > CACHE_TIMEOUT)

                    vm.hasDoneASearch = true;

                    if (!vm.pastTimeout) {
                        $scope.searchResults = $localStorage.searchResults.results;
                        $scope.displayedResults = [].concat($scope.searchResults);
                        vm.activeSearch = true;
                        vm.resultCount = $localStorage.searchResults.recordCount;

                        if ($localStorage.query) {
                            vm.query = $localStorage.query;
                            $scope.visiblePage = vm.query.pageNumber + 1;
                        }
                    } else {
                        //vm.reloadResults();
                    }
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
                if (vm.query.developerObject !== undefined) {
                    if (typeof(vm.query.developerObject) === 'string' && vm.query.developerObject.length > 0) {
                        vm.query.developerObject = {type: 'previous search', value: vm.query.developerObject};
                        vm.lookaheadSource.developers.push(vm.query.developerObject);
                    }
                    vm.query.developer = vm.query.developerObject.value;
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
                        $localStorage.searchTimestamp = Math.floor((new Date()).getTime() / 1000 / 60);
                        $scope.searchResults = data.results;
                        $scope.displayedResults = [].concat($scope.searchResults);
                        vm.resultCount = data.recordCount;
                    }, function (error) {
                        vm.errorResult();
                    });

                $localStorage.query = vm.query;
            }

            function toggleCompare (row) {
                var toAdd = true;
                for (var i = 0; i < vm.compareCps.length; i++) {
                    if (vm.compareCps[i].id === row.id) {
                        vm.compareCps.splice(i,1);
                        toAdd = false;
                    }
                }
                if (toAdd) {
                    vm.compareCps.push(row);
                }
                vm.boxes.compare = true;
            }

			function toggleCart (row) {
				if (chplCertIdWidget.isProductInCart(row.id)) {
					chplCertIdWidget.removeProductFromCart(row.id);
				} else {
					chplCertIdWidget.addProductToCart(row.id);
                }
				vm.boxes.certificationId = true;
            }

            function truncButton (str) {
                var ret = str;
                if (str.length > 20) {
                    ret = ret.substring(0,20) + '&#8230;';
                }
                ret +='<span class="pull-right"><i class="fa fa-close"></i></span><span class="sr-only">Remove ' + str + ' from compare</span>';
                return ret;
            }

            function unrefine (key, cert) {
                switch (key) {
                case 'developer':
                    delete(vm.query.developer);
                    delete(vm.query.developerObject);
                    delete(vm.refine.developer);
                    break;
                case 'product':
                    delete(vm.query.product);
                    delete(vm.query.productObject);
                    delete(vm.refine.product);
                    if (vm.query.orderBy === 'version') {
                        vm.query.orderBy = 'product';
                    }
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

            function viewProduct (cp) {
                var toAdd = true;
                for (var i = 0; i < vm.previouslyViewed.length; i++) {
                    if (vm.previouslyViewed[i].id === cp.id) {
                        toAdd = false;
                    }
                }
                if (toAdd) {
                    vm.previouslyViewed.push(cp);
                    if (vm.previouslyViewed.length > 20) {
                        vm.previouslyViewed.shift();
                    }
                    $localStorage.previouslyViewed = vm.previouslyViewed;
                }
                $location.url('/product/' + cp.id);
            }


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
                return vm.hasDoneASearch && vm.activeSearch;
            };

            $scope.browseAll = function () {
                $scope.clear();
                vm.activeSearch = true;
                vm.search();
            };

            vm.errorResult = function () {
                delete $localStorage.searchResults;
                vm.hasDoneASearch = true;
                $scope.searchResults = [];
                $scope.displayedResults = [];
                $scope.visiblePage = 1;
                vm.resultCount = 0;
                vm.compareCps = [];
            };

            function clear () {
                delete $localStorage.searchResults;
                delete $localStorage.query;
                delete $localStorage.lookaheadSource;
                delete $localStorage.refine;
                $scope.searchResults = [];
                $scope.displayedResults = [];
                $scope.visiblePage = 1;
                vm.resultCount = 0;
                vm.compareCps = [];;
                vm.hasDoneASearch = false;
                vm.activeSearch = false;
                vm.query = angular.copy(vm.defaultQuery);
                vm.refineType = '';
                vm.refine = angular.copy(vm.defaultRefine);
                if (vm.searchForm) {
                    vm.searchForm.$setPristine();
                }
            }
            $scope.clear = clear;

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

/* eslint-disable */
(function () {
    'use strict';

    angular.module('chpl.search')
        .controller('SearchController', SearchController);

    /** @ngInject */
    function SearchController ($scope, $log, $location, $localStorage, $filter, commonService, utilService, CACHE_TIMEOUT) {
        var vm = this;

        vm.clear = clear;
        vm.clearFilters = clearFilters;
        vm.clearPreviouslyCompared = clearPreviouslyCompared;
        vm.clearPreviouslyViewed = clearPreviouslyViewed;
        vm.clearSurveillanceActivityFilter = clearSurveillanceActivityFilter;
        vm.certificationStatusFilter = certificationStatusFilter;
        vm.compare = compare;
        vm.isCategoryChanged = isCategoryChanged;
        vm.isChangedFromDefault = isChangedFromDefault;
        vm.populateSearchOptions = populateSearchOptions;
        vm.reloadResults = reloadResults;
        vm.restoreResults = restoreResults
        vm.search = search;
        vm.setRefine = setRefine;
        vm.sortCert = utilService.sortCert;
        vm.sortCqm = utilService.sortCqm;
        vm.statusFont = statusFont;
        vm.toggleCompare = toggleCompare;
        vm.truncButton = truncButton;
        vm.viewProduct = viewProduct;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.activeSearch = false;
            vm.resultCount = 0;
            vm.defaultRefineModel = {
                certificationStatus: {
                    'Active': true,
                    'Retired': false,
                    'Suspended by ONC-ACB': true,
                    'Withdrawn by Developer': false,
                    'Withdrawn by Developer Under Surveillance/Review': false,
                    'Withdrawn by ONC-ACB': false,
                    'Suspended by ONC': true,
                    'Terminated by ONC': false
                },
                certificationEdition: {
                    '2011': false,
                    '2014': true,
                    '2015': true
                },
                acb: {
                    'Drummond Group': true,
                    'ICSA Labs': true,
                    'InfoGard': true
                }
            };
            if ($localStorage.refineModel) {
                vm.refineModel = $localStorage.refineModel;
            } else {
                vm.refineModel = angular.copy(vm.defaultRefineModel);
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
                prevView: false
            };
            if ($localStorage.widget && $localStorage.widget.productIds && $localStorage.widget.productIds.length > 0) {
			    vm.boxes.certificationId = true;
            }
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

            $scope.$on('ClearResults', function () {
                clear();
                delete $localStorage.clearResults;
            });
        }

        function clearFilters () {
            delete $localStorage.refineModel;
            delete $localStorage.query;

            var searchTerm, searchTermObject;
            if (vm.query.searchTerm) {
                searchTerm = vm.query.searchTerm;
            }
            if (vm.query.searchTermObject) {
                searchTermObject = vm.query.searchTermObject;
            }
            vm.refineModel = angular.copy(vm.defaultRefineModel);
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

        function clearSurveillanceActivityFilter () {
            vm.refineModel.hasHadSurveillance = undefined;
            vm.refineModel.surveillance = {};
        }

        function certificationStatusFilter (obj) {
            if (!obj.statuses) {
                return true;
            } else {
                return ((obj.statuses['active'] > 0 && vm.refineModel.certificationStatus['Active']) ||
                        (obj.statuses['withdrawnByAcb'] > 0 && vm.refineModel.certificationStatus['Withdrawn by ONC-ACB']) ||
                        (obj.statuses['withdrawnByDeveloper'] > 0 && vm.refineModel.certificationStatus['Withdrawn by Developer']) ||
                        (obj.statuses['withdrawnByDeveloperUnderSurveillanceReview'] > 0 && vm.refineModel.certificationStatus['Withdrawn by Developer Under Surveillance/Review']) ||
                        (obj.statuses['suspendedByAcb'] > 0 && vm.refineModel.certificationStatus['Suspended by ONC-ACB']) ||
                        (obj.statuses['suspendedByOnc'] > 0 && vm.refineModel.certificationStatus['Suspended by ONC']) ||
                        (obj.statuses['terminatedByOnc'] > 0 && vm.refineModel.certificationStatus['Terminated by ONC']) ||
                        (obj.statuses['retired'] > 0 && vm.refineModel.certificationStatus['Retired']));
            }
        }

        function compare () {
            var comparePath = '/compare/';
            var i;
            for (i = 0; i < vm.compareCps.length; i++) {
                comparePath += vm.compareCps[i].id + '&';
            }
            comparePath = comparePath.substring(0, comparePath.length - 1);
            if (comparePath.indexOf('&') > 0) {
                var prev = $localStorage.previouslyCompared;
                var toAdd;
                for (i = 0; i < vm.compareCps.length; i++) {
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

        function isCategoryChanged (categories) {
            var ret = false;
            for (var i = 0; i < categories.length; i++) {
                angular.forEach(vm.refineModel[categories[i]], function (value, key) {
                    ret = ret || vm.isChangedFromDefault (categories[i], key);
                });
            }
            return ret;
        }

        function isChangedFromDefault (index, data) {
            if (!vm.defaultRefineModel[index]) {
                if (vm.refineModel[index]) {
                    if (angular.isObject(vm.refineModel[index])) {
                        return vm.refineModel[index][data];
                    } else {
                        return true;
                    }
                }
            } else {
                return (vm.defaultRefineModel[index][data] !== vm.refineModel[index][data]);
            }
        }

        function populateSearchOptions () {
            commonService.getSearchOptions() // use 'true' in production, to hide retired CQMs & Certs
                .then(function (options) {
                    var i;
                    vm.certs = options.certificationCriterionNumbers;
                    vm.cqms = options.cqmCriterionNumbers;
                    vm.editions = options.editions;
                    vm.practices = options.practiceTypeNames;
                    vm.certBodies = options.certBodyNames;
                    vm.certificationStatuses = options.certificationStatuses;
                    for (i = 0; i < vm.certificationStatuses.length; i++) {
                        if (vm.certificationStatuses[i].name === 'Pending') {
                            vm.certificationStatuses.splice(i,1);
                            break;
                        }
                    }
                    vm.certsNcqms = options.certificationCriterionNumbers.concat(options.cqmCriterionNumbers);
                    for (i = 0; i < options.developerNames.length; i++) {
                        vm.lookaheadSource.all.push({type: 'developer', value: options.developerNames[i].name, statuses: options.developerNames[i].statuses});
                        vm.lookaheadSource.developers.push({type: 'developer', value: options.developerNames[i].name, statuses: options.developerNames[i].statuses});
                    }
                    for (i = 0; i < options.productNames.length; i++) {
                        vm.lookaheadSource.all.push({type: 'product', value: options.productNames[i].name, statuses: options.productNames[i].statuses});
                        vm.lookaheadSource.products.push({type: 'product', value: options.productNames[i].name, statuses: options.productNames[i].statuses});
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
            vm.setRefine();
            if (angular.isDefined(vm.query.searchTermObject)) {
                if (angular.isString(vm.query.searchTermObject) && vm.query.searchTermObject.length > 0) {
                    vm.query.searchTermObject = {type: 'previous search', value: vm.query.searchTermObject};
                    vm.lookaheadSource.all.push(vm.query.searchTermObject);
                }
                vm.query.searchTerm = angular.copy(vm.query.searchTermObject.value);
            } else {
                vm.query.searchTerm = undefined;
            }
            if (angular.isDefined(vm.query.developerObject)) {
                if (angular.isString(vm.query.developerObject) && vm.query.developerObject.length > 0) {
                    vm.query.developerObject = {type: 'previous search', value: vm.query.developerObject};
                    vm.lookaheadSource.developers.push(vm.query.developerObject);
                }
                vm.query.developer = vm.query.developerObject.value;
            } else {
                vm.query.developer = undefined;
            }
            if (angular.isDefined(vm.query.productObject)) {
                if (angular.isString(vm.query.productObject) && vm.query.productObject.length > 0) {
                    vm.query.productObject = {type: 'previous search', value: vm.query.productObject};
                    vm.lookaheadSource.products.push(vm.query.productObject);
                }
                vm.query.product = vm.query.productObject.value;
            } else {
                vm.query.product = undefined;
            }
            $localStorage.lookaheadSource = vm.lookaheadSource;
            $localStorage.refineModel = vm.refineModel;
            commonService.search(vm.query)
                .then(function (data) {
                    vm.hasDoneASearch = true;
                    vm.activeSearch = true;

                    $localStorage.searchResults = data;
                    $localStorage.searchTimestamp = Math.floor((new Date()).getTime() / 1000 / 60);
                    $scope.searchResults = data.results;
                    $scope.displayedResults = [].concat($scope.searchResults);
                    vm.resultCount = data.recordCount;
                }, function () {
                    vm.errorResult();
                });

            $localStorage.query = vm.query;
        }

        function setRefine () {
            vm.query.certificationBodies = [];
            vm.query.certificationCriteria = [];
            vm.query.certificationEditions = [];
            vm.query.certificationStatuses = [];
            vm.query.cqms = [];
            vm.query.surveillance = [];
            vm.query.practiceType = vm.refineModel.practiceType;
            if (vm.refineModel.developer) {
                vm.query.developerObject = vm.refineModel.developer;
            } else {
                vm.query.developerObject = undefined;
            }
            if (vm.refineModel.product) {
                vm.query.productObject = vm.refineModel.product;
            } else {
                vm.query.productObject = undefined;
            }
            vm.query.version = vm.refineModel.version;

            angular.forEach(vm.refineModel.acb, function (value, key) {
                if (value) { this.push(key); }
            }, vm.query.certificationBodies);
            angular.forEach(vm.refineModel.certificationCriteria, function (value, key) {
                if (value) { this.push(key); }
            }, vm.query.certificationCriteria);
            angular.forEach(vm.refineModel.certificationEdition, function (value, key) {
                if (value) { this.push(key); }
            }, vm.query.certificationEditions);
            angular.forEach(vm.refineModel.certificationStatus, function (value, key) {
                if (value) { this.push(key); }
            }, vm.query.certificationStatuses);
            angular.forEach(vm.refineModel.cqms, function (value, key) {
                if (value) { this.push(key); }
            }, vm.query.cqms);
            if (vm.refineModel.hasHadSurveillance === 'has-had') {
                vm.query.hasHadSurveillance = true;
                angular.forEach(vm.refineModel.surveillance, function (value, key) {
                    if (value) { this.push(key); }
                }, vm.query.surveillance);
            } else if (vm.refineModel.hasHadSurveillance === 'never') {
                vm.query.hasHadSurveillance = false;
            }
        }

        function statusFont (status) {
            var ret;
            switch (status) {
            case 'Active':
                ret = 'fa-check-circle status-good';
                break;
            case 'Retired':
                ret = 'fa-university status-neutral';
                break;
            case 'Suspended by ONC':
                ret = 'fa-minus-square status-warning';
                break;
            case 'Suspended by ONC-ACB':
                ret = 'fa-minus-circle status-warning';
                break;
            case 'Terminated by ONC':
                ret = 'fa-window-close status-bad';
                break;
            case 'Withdrawn by Developer Under Surveillance/Review':
                ret = 'fa-exclamation-circle status-bad';
                break;
            case 'Withdrawn by Developer':
                ret = 'fa-stop-circle status-neutral';
                break;
            case 'Withdrawn by ONC-ACB':
                ret = 'fa-times-circle status-bad';
                break;
            }
            return ret;
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

        function truncButton (str) {
            var ret = str;
            if (str.length > 20) {
                ret = ret.substring(0,20) + '&#8230;';
            }
            ret +='<span class="pull-right"><i class="fa fa-close"></i></span><span class="sr-only">Remove ' + str + ' from compare</span>';
            return ret;
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
            return angular.isDefined($scope.searchResults) && $scope.searchResults.length > 0;
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
            vm.compareCps = [];
            vm.hasDoneASearch = false;
            vm.activeSearch = false;
            vm.query = angular.copy(vm.defaultQuery);
            vm.refineType = '';
            vm.refineModel = angular.copy(vm.defaultRefineModel);
            if (vm.searchForm) {
                vm.searchForm.$setPristine();
            }
        }
        $scope.clear = clear;

        $scope.sort = function (header) {
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
    }
})();

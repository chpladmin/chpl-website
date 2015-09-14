;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('ReportController', ['$log', 'commonService', 'authService', 'reportService', function($log, commonService, authService, reportService) {
            var self = this;
            commonService.getCertifiedProductActivity()
                .then(function (data) {
                    self.searchedCertifiedProducts = data;
                    self.displayedCertifiedProducts = [].concat(self.searchedCertifiedProducts);
                });
            commonService.getVendorActivity()
                .then(function (data) {
                    self.searchedVendors = data;
                    self.displayedVendors = [].concat(self.searchedVendors);
                });
            commonService.getProductActivity()
                .then(function (data) {
                    self.searchedProducts = data;
                    self.displayedProducts = [].concat(self.searchedProducts);
                });
            commonService.getAcbActivity()
                .then(function (data) {
                    self.searchedACBs = data;
                    self.displayedACBs = [].concat(self.searchedACBs);
                });

            self.isAcbAdmin = authService.isAcbAdmin();
            self.isChplAdmin = authService.isChplAdmin();

            self.sourceMedium = {
                type: 'PieChart',
                displayed: true,
                options: {
                    sliceVisibilityThreshold: .4,
                    is3D: true,
                    title: 'Source / Medium (last 7 days)'
                }
            };
            self.browserVariety = {
                type: 'PieChart',
                displayed: true,
                options: {
                    is3D: true,
                    title: 'Visitors by browser (last 7 days)'
                }
            };
            self.cities = {
                type: 'PieChart',
                displayed: true,
                options: {
                    is3D: true,
                    title: 'Visitors by city (last 7 days)'
                }
            };
            self.country = {
                type: 'PieChart',
                displayed: true,
                options: {
                    is3D: true,
                    title: 'Visitors by country (last 7 days)'
                }
            };
            self.traffic = {
                type: 'LineChart',
                displayed: true,
                options: {
                    curveType: 'function',
                    hAxis: {
                        format: 'd MMM yyyy',
                        slantedText: true
                    },
                    legend: null,
                    title: 'Visitors for the last 14 days'
                }
            };

            reportService.getSourceMedium()
                .then(function (data) {
                    $log.debug(data);
                    self.sourceMedium.data = data;
                });
            reportService.getBrowserVariety()
                .then(function (data) {
                    $log.debug(data);
                    self.browserVariety.data = data;
                });
            reportService.getCountry()
                .then(function (data) {
                    $log.debug(data);
                    self.country.data = data;
                });
            reportService.getCities()
                .then(function (data) {
                    $log.debug(data);
                    self.cities.data = data;
                });
            reportService.getTraffic()
                .then(function (data) {
                    $log.debug(data)
                    self.traffic.data = data;
                });
        }])
        .service('reportService', ['commonService', '$log', function (commonService, $log) {
            var self = this;

            self.getSourceMedium = function () {
                return commonService.simpleApiCall('https://openchpl.appspot.com/query?id=agpzfm9wZW5jaHBschULEghBcGlRdWVyeRiAgICAgICACgw&format=data-table','');
            };
            self.getBrowserVariety = function () {
                return commonService.simpleApiCall('https://openchpl.appspot.com/query?id=agpzfm9wZW5jaHBschULEghBcGlRdWVyeRiAgICAvKGCCgw&format=data-table','');
            };
            self.getCities = function () {
                return commonService.simpleApiCall('https://openchpl.appspot.com/query?id=agpzfm9wZW5jaHBschULEghBcGlRdWVyeRiAgICAmdKFCgw&format=data-table','');
            };
            self.getCountry = function () {
                return commonService.simpleApiCall('https://openchpl.appspot.com/query?id=agpzfm9wZW5jaHBschULEghBcGlRdWVyeRiAgICA2uOGCgw&format=data-table','');
            };
            self.getTraffic = function () {
                return commonService.simpleApiCall('https://openchpl.appspot.com/query?id=agpzfm9wZW5jaHBschULEghBcGlRdWVyeRiAgICA7bGDCgw&format=data-table','');
            };
        }])
        .directive('aiReports', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'admin/components/reports.html',
                scope: {},
                controllerAs: 'vm',
                controller: 'ReportController'
            };
        });
})();

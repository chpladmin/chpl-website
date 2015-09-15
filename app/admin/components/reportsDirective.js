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

            self.browserVariety = {
                type: 'PieChart',
                options: {
                    is3D: true,
                    title: 'Visitors by browser (last 7 days)'
                }
            };
            self.cities = {
                type: 'PieChart',
                options: {
                    is3D: true,
                    title: 'Visitors by city (last 7 days)'
                }
            };
            self.country = {
                type: 'PieChart',
                options: {
                    is3D: true,
                    title: 'Visitors by country (last 7 days)'
                }
            };
            self.traffic = {
                type: 'LineChart',
                options: {
                    legend: { position: 'none' },
                    hAxis: {
                        slantedText: true
                    },
                    title: 'Visitors for the last 14 days'
                }
            };
            self.map = {
                type: 'GeoChart',
                options: {
                }
            };
            self.cityMap = {
                type: 'GeoChart',
                options: {
                    region: 'US',
                    displayMode: 'markers'
                }
            };

            reportService.getBrowserVariety()
                .then(function (data) {
                    self.browserVariety.data = data;
                });
            reportService.getCountry()
                .then(function (data) {
                    self.country.data = data;
                    self.map.data = data;
                });
            reportService.getCities()
                .then(function (data) {
                    self.cities.data = data;
                    self.cityMap.data = data;
                });
            reportService.getTraffic()
                .then(function (data) {
                    data.cols[0].type = 'date';
                    var date;
                    for (var i = 0; i < data.rows.length; i++) {
                        date = data.rows[i].c[0].v;
                        data.rows[i].c[0].v = new Date(date.substring(0,4),
                                                       parseInt(date.substring(4,6)) - 1,
                                                       date.substring(6,8));
                    }
                    self.traffic.data = data;
                });
        }])
        .service('reportService', ['commonService', '$log', function (commonService, $log) {
            var self = this;

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

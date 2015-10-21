;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('ReportController', ['$log', 'commonService', 'authService', function($log, commonService, authService) {
            var vm = this;
            vm.isAcbAdmin = authService.isAcbAdmin();
            vm.isChplAdmin = authService.isChplAdmin();
            vm.tab = 'activity';

            vm.activate = activate;
            vm.refreshActivity = refreshActivity;
            vm.changeTab = changeTab;

            vm.activate();

            ////////////////////////////////////////////////////////////////////
            // Chart options

            vm.browserVariety = {
                type: 'PieChart',
                options: {
                    is3D: true,
                    title: 'Visitors by browser (last 7 days)'
                }
            };
            vm.cities = {
                type: 'PieChart',
                options: {
                    is3D: true,
                    title: 'Visitors by city (last 7 days)'
                }
            };
            vm.country = {
                type: 'PieChart',
                options: {
                    is3D: true,
                    title: 'Visitors by country (last 7 days)'
                }
            };
            vm.traffic = {
                type: 'LineChart',
                options: {
                    legend: { position: 'none' },
                    hAxis: {
                        slantedText: true
                    },
                    title: 'Visitors for the last 14 days'
                }
            };
            vm.map = {
                type: 'GeoChart',
                options: {
                }
            };
            vm.cityMap = {
                type: 'GeoChart',
                options: {
                    region: 'US',
                    displayMode: 'markers'
                }
            };

            ////////////////////////////////////////////////////////////////////
            // Functions

            function activate () {
                vm.refreshActivity();
                commonService.simpleApiCall('https://openchpl.appspot.com/query?id=agpzfm9wZW5jaHBschULEghBcGlRdWVyeRiAgICAvKGCCgw&format=data-table','')
                    .then(function (data) {
                        vm.browserVariety.data = data;
                    });
                commonService.simpleApiCall('https://openchpl.appspot.com/query?id=agpzfm9wZW5jaHBschULEghBcGlRdWVyeRiAgICA2uOGCgw&format=data-table','')
                    .then(function (data) {
                        vm.country.data = data;
                        vm.map.data = data;
                    });
                commonService.simpleApiCall('https://openchpl.appspot.com/query?id=agpzfm9wZW5jaHBschULEghBcGlRdWVyeRiAgICAmdKFCgw&format=data-table','')
                    .then(function (data) {
                        vm.cities.data = data;
                        vm.cityMap.data = data;
                    });
                commonService.simpleApiCall('https://openchpl.appspot.com/query?id=agpzfm9wZW5jaHBschULEghBcGlRdWVyeRiAgICA7bGDCgw&format=data-table','')
                    .then(function (data) {
                        data.cols[0].type = 'date';
                        var date;
                        for (var i = 0; i < data.rows.length; i++) {
                            date = data.rows[i].c[0].v;
                            data.rows[i].c[0].v = new Date(date.substring(0,4),
                                                           parseInt(date.substring(4,6)) - 1,
                                                           date.substring(6,8));
                        }
                        vm.traffic.data = data;
                    });
            }

            function refreshActivity () {
                commonService.getCertifiedProductActivity(7)
                    .then(function (data) {
                        vm.searchedCertifiedProducts = data;
                        vm.displayedCertifiedProducts = [].concat(vm.searchedCertifiedProducts);
                    });
                commonService.getVendorActivity(7)
                    .then(function (data) {
                        vm.searchedVendors = vm.interpretVendors(data);
                        vm.displayedVendors = [].concat(vm.searchedVendors);
                    });
                commonService.getProductActivity(7)
                    .then(function (data) {
                        vm.searchedProducts = data;
                        vm.displayedProducts = [].concat(vm.searchedProducts);
                    });
                commonService.getAcbActivity(7)
                    .then(function (data) {
                        vm.searchedACBs = data;
                        vm.displayedACBs = [].concat(vm.searchedACBs);
                    });
            }

            function changeTab(newTab) {
                vm.tab = newTab;
                if (newTab === 'activity')
                    vm.refreshActivity();
            }

            ////////////////////////////////////////////////////////////////////
            // Helper functions

            vm.interpretVendors = function (data) {
                var ret = [];
                var change;

                for (var i = 0; i < data.length; i++) {
                    var activity = {date: data[i].activityDate};
                    if (data[i].originalData && !Array.isArray(data[i].originalData) && data[i].newData) { // both exist, originalData not an array: update
                        activity.name = data[i].newData.name;
                        activity.action = ['Update:<ul>'];
                        if (data[i].newData.deleted !== data[i].originalData.deleted) {
                            activity.action.push(data[i].newData.deleted ? 'Deleted' : 'Created');
                        }
                        change = vm.compareItem(data[i].originalData, data[i].newData, 'name', 'Name');
                        if (change) activity.action.push('<li>' + change + '</li>');
                        change = vm.compareItem(data[i].originalData, data[i].newData, 'website', 'Website');
                        if (change) activity.action.push('<li>' + change + '</li>');
                        if (data[i].originalData.address !== data[i].newData.address) {
                            activity.action.push('<li>Address changed:<ul>');
                            change = vm.compareItem(data[i].originalData.address, data[i].newData.address, 'streetLineOne', 'Street Line 1');
                            if (change) activity.action.push('<li>' + change + '</li>');
                            change = vm.compareItem(data[i].originalData.address, data[i].newData.address, 'streetLineTwo', 'Street Line 2');
                            if (change) activity.action.push('<li>' + change + '</li>');
                            change = vm.compareItem(data[i].originalData.address, data[i].newData.address, 'city', 'City');
                            if (change) activity.action.push('<li>' + change + '</li>');
                            change = vm.compareItem(data[i].originalData.address, data[i].newData.address, 'state', 'State');
                            if (change) activity.action.push('<li>' + change + '</li>');
                            change = vm.compareItem(data[i].originalData.address, data[i].newData.address, 'zipcode', 'Zipcode');
                            if (change) activity.action.push('<li>' + change + '</li>');
                            change = vm.compareItem(data[i].originalData.address, data[i].newData.address, 'country', 'Country');
                            if (change) activity.action.push('<li>' + change + '</li>');
                            activity.action.push('</ul></li>');
                        }
                        activity.action.push('</ul>');
                    }

                    if (data[i].originalData && !data[i].newData) { // no new data: deleted
                        activity.name = data[i].originalData.name;
                        activity.action = [activity.name + ' has been deleted'];
                    }

                    if (!data[i].originalData && data[i].newData) { // no old data: created
                        activity.name = data[i].newData.name;
                        activity.action = [activity.name + ' has been created'];
                    }
                    if (data[i].originalData && data[i].originalData.length > 1 && data[i].newData) { // both exist, more than one originalData: update
                        activity.name = data[i].newData.name;
                        activity.action = ['Merged ' + data[i].originalData.length + ' developers to form developer: ' + activity.name];
                    }
                    ret.push(activity);
                }
                return ret;
            }

            vm.compareItem = function (oldData, newData, key, display) {
                if (oldData && oldData[key] && newData && newData[key] && oldData[key] !== newData[key]) {
                    return display + ' changed from ' + oldData[key] + ' to ' + newData[key];
                }
                if ((!oldData || !oldData[key]) && newData && newData[key]) {
                    return display + ' added: ' + newData[key];
                }
                if (oldData && oldData[key] && (!newData || !newData[key])) {
                    return display + ' removed. Was: ' + oldData[key];
                }
            }

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

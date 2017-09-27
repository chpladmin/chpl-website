(function () {
    'use strict';

    angular.module('chpl.charts')
        .controller('ChartsController', ChartsController);

    /** @ngInclude */
    function ChartsController ($log, networkService) {
        var vm = this;

        vm.applyFilter = applyFilter;
        vm.toggleSeries = toggleSeries;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.statistics = [];
            vm.statisticTypes = [];
            networkService.getStatisticTypes().then(function (types) {
                vm.statisticTypes = types;
            });
            networkService.getStatistics().then(function (stats) {
                vm.statistics = stats;
                _parseData();
                applyFilter();
            }, function () {
                loadFakeData();
                applyFilter();
            });
            vm.chart = {
                type: 'LineChart',
                data: {
                    cols: [{ label: 'Date', type: 'date' }],
                },
                options: {
                    title: 'Unique Products over Time',
                    colors: ['#00f', '#090', '#c00', '#d90'],
                    defaultColors: ['#00f', '#090', '#c00', '#d90'],
                    isStacked: 'true',
                    fill: 20,
                    displayExactValues: true,
                    vAxis: {
                        title: 'Unique Products',
                    },
                    hAxis: {
                        title: 'Date',
                    },
                },
                view: {columns: [0, 1, 2, 3, 4]},
            };
        }

        function applyFilter () {
            vm.chart.data.rows = vm.safeRows.filter(function (row) {
                return (!vm.startDate || vm.startDate <= row.c[0].v) &&
                    (!vm.endDate || vm.endDate >= row.c[0].v);
            });
        }

        function toggleSeries (selectedItem) {
            var col = selectedItem.column;
            if (selectedItem.row === null) {
                if (vm.chart.view.columns[col] === col) {
                    vm.chart.view.columns[col] = {
                        label: vm.chart.data.cols[col].label,
                        type: vm.chart.data.cols[col].type,
                        calc: function () {
                            return null;
                        },
                    };
                    vm.chart.options.colors[col - 1] = '#ccc';
                }
                else {
                    vm.chart.view.columns[col] = col;
                    vm.chart.options.colors[col - 1] = vm.chart.options.defaultColors[col - 1];
                }
            }
        }

        function loadFakeData () {
            vm.startDate = new Date('Fri Apr 08 2016');
            vm.endDate = new Date('Fri Aug 11 2017');
            vm.chart.data = {
                cols: [
                    { label: 'Date', type: 'date' },
                    {label: 'Total Number of Unique Products over time', type: 'number' },
                    {label: 'Total Number of Unique Products w/ Active Listings Over Time', type: 'number' },
                    {label: 'Total Number of Unique Products w/ Active 2014 Listings', type: 'number' },
                    {label: 'Total Number of Unique Products w/ Active 2015 Listings', type: 'number' },
                ],
            };
            vm.safeRows = [
                {c: [{v: new Date('Fri Apr 08 2016')},{v: 2302},{v: 1070 + 1},{v: 1070},{v: 1}]},
                {c: [{v: new Date('Fri Apr 08 2016')},{v: 2302},{v: 1070 + 1},{v: 1070},{v: 1}]},
                {c: [{v: new Date('Fri Apr 15 2016')},{v: 2303},{v: 1072 + 2},{v: 1072},{v: 2}]},
                {c: [{v: new Date('Fri Apr 22 2016')},{v: 2303},{v: 1072 + 2},{v: 1072},{v: 2}]},
                {c: [{v: new Date('Fri Apr 29 2016')},{v: 2307},{v: 1076 + 2},{v: 1076},{v: 2}]},
                {c: [{v: new Date('Fri May 06 2016')},{v: 2312},{v: 1083 + 2},{v: 1083},{v: 2}]},
                {c: [{v: new Date('Fri May 13 2016')},{v: 2312},{v: 1083 + 3},{v: 1083},{v: 3}]},
                {c: [{v: new Date('Fri May 20 2016')},{v: 2313},{v: 1084 + 3},{v: 1084},{v: 3}]},
                {c: [{v: new Date('Fri May 27 2016')},{v: 2315},{v: 1086 + 3},{v: 1086},{v: 3}]},
                {c: [{v: new Date('Fri Jun 03 2016')},{v: 2315},{v: 1088 + 3},{v: 1088},{v: 3}]},
                {c: [{v: new Date('Fri Jun 10 2016')},{v: 2315},{v: 1089 + 3},{v: 1089},{v: 3}]},
                {c: [{v: new Date('Fri Jun 17 2016')},{v: 2317},{v: 1092 + 3},{v: 1092},{v: 3}]},
                {c: [{v: new Date('Fri Jun 24 2016')},{v: 2321},{v: 1094 + 6},{v: 1094},{v: 6}]},
                {c: [{v: new Date('Fri Jul 01 2016')},{v: 2322},{v: 1097 + 6},{v: 1097},{v: 6}]},
                {c: [{v: new Date('Fri Jul 08 2016')},{v: 2325},{v: 1100 + 7},{v: 1100},{v: 7}]},
                {c: [{v: new Date('Fri Jul 15 2016')},{v: 2325},{v: 1100 + 7},{v: 1100},{v: 7}]},
                {c: [{v: new Date('Fri Jul 22 2016')},{v: 2326},{v: 1101 + 7},{v: 1101},{v: 7}]},
                {c: [{v: new Date('Fri Jul 29 2016')},{v: 2329},{v: 1104 + 7},{v: 1104},{v: 7}]},
                {c: [{v: new Date('Fri Aug 05 2016')},{v: 2332},{v: 1106 + 8},{v: 1106},{v: 8}]},
                {c: [{v: new Date('Fri Aug 12 2016')},{v: 2334},{v: 1106 + 8},{v: 1106},{v: 8}]},
                {c: [{v: new Date('Fri Aug 19 2016')},{v: 2337},{v: 1109 + 8},{v: 1109},{v: 8}]},
                {c: [{v: new Date('Fri Aug 26 2016')},{v: 2338},{v: 1109 + 9},{v: 1109},{v: 9}]},
                {c: [{v: new Date('Fri Sep 02 2016')},{v: 2339},{v: 1110 + 9},{v: 1110},{v: 9}]},
                {c: [{v: new Date('Fri Sep 09 2016')},{v: 2339},{v: 1110 + 10},{v: 1110},{v: 10}]},
                {c: [{v: new Date('Fri Sep 16 2016')},{v: 2340},{v: 1112 + 10},{v: 1112},{v: 10}]},
                {c: [{v: new Date('Fri Sep 23 2016')},{v: 2343},{v: 1115 + 10},{v: 1115},{v: 10}]},
                {c: [{v: new Date('Fri Sep 30 2016')},{v: 2343},{v: 1115 + 10},{v: 1115},{v: 10}]},
                {c: [{v: new Date('Fri Oct 07 2016')},{v: 2359},{v: 1131 + 11},{v: 1131},{v: 11}]},
                {c: [{v: new Date('Fri Oct 14 2016')},{v: 2360},{v: 1133 + 11},{v: 1133},{v: 11}]},
                {c: [{v: new Date('Fri Oct 21 2016')},{v: 2360},{v: 1138 + 11},{v: 1138},{v: 11}]},
                {c: [{v: new Date('Fri Oct 28 2016')},{v: 2362},{v: 1141 + 11},{v: 1141},{v: 11}]},
                {c: [{v: new Date('Fri Nov 04 2016')},{v: 2362},{v: 1143 + 12},{v: 1143},{v: 12}]},
                {c: [{v: new Date('Fri Nov 11 2016')},{v: 2365},{v: 1145 + 14},{v: 1145},{v: 14}]},
                {c: [{v: new Date('Fri Nov 18 2016')},{v: 2367},{v: 1146 + 13},{v: 1146},{v: 13}]},
                {c: [{v: new Date('Fri Nov 25 2016')},{v: 2373},{v: 1152 + 15},{v: 1152},{v: 15}]},
                {c: [{v: new Date('Fri Dec 02 2016')},{v: 2374},{v: 1153 + 15},{v: 1153},{v: 15}]},
                {c: [{v: new Date('Fri Dec 09 2016')},{v: 2376},{v: 1155 + 18},{v: 1155},{v: 18}]},
                {c: [{v: new Date('Fri Dec 16 2016')},{v: 2378},{v: 1156 + 22},{v: 1156},{v: 22}]},
                {c: [{v: new Date('Fri Dec 23 2016')},{v: 2384},{v: 1160 + 26},{v: 1160},{v: 26}]},
                {c: [{v: new Date('Fri Dec 30 2016')},{v: 2391},{v: 1166 + 29},{v: 1166},{v: 29}]},
                {c: [{v: new Date('Fri Jan 06 2017')},{v: 2393},{v: 1167 + 31},{v: 1167},{v: 31}]},
                {c: [{v: new Date('Fri Jan 13 2017')},{v: 2397},{v: 1169 + 31},{v: 1169},{v: 31}]},
                {c: [{v: new Date('Fri Jan 20 2017')},{v: 2398},{v: 1170 + 31},{v: 1170},{v: 31}]},
                {c: [{v: new Date('Fri Jan 27 2017')},{v: 2400},{v: 1173 + 32},{v: 1173},{v: 32}]},
                {c: [{v: new Date('Fri Feb 03 2017')},{v: 2404},{v: 1176 + 35},{v: 1176},{v: 35}]},
                {c: [{v: new Date('Fri Feb 10 2017')},{v: 2406},{v: 1176 + 39},{v: 1176},{v: 39}]},
                {c: [{v: new Date('Fri Feb 17 2017')},{v: 2408},{v: 1180 + 41},{v: 1180},{v: 41}]},
                {c: [{v: new Date('Fri Feb 24 2017')},{v: 2409},{v: 1182 + 43},{v: 1182},{v: 43}]},
                {c: [{v: new Date('Fri Mar 03 2017')},{v: 2410},{v: 1182 + 44},{v: 1182},{v: 44}]},
                {c: [{v: new Date('Fri Mar 10 2017')},{v: 2412},{v: 1185 + 44},{v: 1185},{v: 44}]},
                {c: [{v: new Date('Fri Mar 17 2017')},{v: 2415},{v: 1186 + 47},{v: 1186},{v: 47}]},
                {c: [{v: new Date('Fri Mar 24 2017')},{v: 2415},{v: 1186 + 47},{v: 1186},{v: 47}]},
                {c: [{v: new Date('Fri Mar 31 2017')},{v: 2415},{v: 1188 + 48},{v: 1188},{v: 48}]},
                {c: [{v: new Date('Fri Apr 07 2017')},{v: 2416},{v: 1188 + 49},{v: 1188},{v: 49}]},
                {c: [{v: new Date('Fri Apr 14 2017')},{v: 2417},{v: 1192 + 51},{v: 1192},{v: 51}]},
                {c: [{v: new Date('Fri Apr 21 2017')},{v: 2420},{v: 1194 + 53},{v: 1194},{v: 53}]},
                {c: [{v: new Date('Fri Apr 28 2017')},{v: 2420},{v: 1194 + 53},{v: 1194},{v: 53}]},
                {c: [{v: new Date('Fri May 05 2017')},{v: 2420},{v: 1195 + 56},{v: 1195},{v: 56}]},
                {c: [{v: new Date('Fri May 12 2017')},{v: 2420},{v: 1195 + 56},{v: 1195},{v: 56}]},
                {c: [{v: new Date('Fri May 19 2017')},{v: 2422},{v: 1196 + 59},{v: 1196},{v: 59}]},
                {c: [{v: new Date('Fri May 26 2017')},{v: 2423},{v: 1198 + 61},{v: 1198},{v: 61}]},
                {c: [{v: new Date('Fri Jun 02 2017')},{v: 2426},{v: 1203 + 61},{v: 1203},{v: 61}]},
                {c: [{v: new Date('Fri Jun 09 2017')},{v: 2428},{v: 1205 + 64},{v: 1205},{v: 64}]},
                {c: [{v: new Date('Fri Jun 16 2017')},{v: 2429},{v: 1206 + 66},{v: 1206},{v: 66}]},
                {c: [{v: new Date('Fri Jun 23 2017')},{v: 2431},{v: 1206 + 70},{v: 1206},{v: 70}]},
                {c: [{v: new Date('Fri Jun 30 2017')},{v: 2433},{v: 1208 + 70},{v: 1208},{v: 70}]},
                {c: [{v: new Date('Fri Jul 07 2017')},{v: 2434},{v: 1209 + 70},{v: 1209},{v: 70}]},
                {c: [{v: new Date('Fri Jul 14 2017')},{v: 2439},{v: 1210 + 76},{v: 1210},{v: 76}]},
                {c: [{v: new Date('Fri Jul 21 2017')},{v: 2439},{v: 1210 + 76},{v: 1210},{v: 76}]},
                {c: [{v: new Date('Fri Jul 28 2017')},{v: 2443},{v: 1210 + 80},{v: 1210},{v: 80}]},
                {c: [{v: new Date('Fri Aug 04 2017')},{v: 2443},{v: 1210 + 82},{v: 1210},{v: 82}]},
                {c: [{v: new Date('Fri Aug 11 2017')},{v: 2443},{v: 1210 + 82},{v: 1210},{v: 82}]},
            ];
        }

        ////////////////////////////////////////////////////////////////////

        function _parseData () {
            var c, testDate;
            var mapObj = {};
            vm.minDate = new Date();
            vm.maxDate = new Date('Jan 1 2016');
            angular.forEach(vm.statistics, function (item) {
                vm.chart.data.cols.push({ label: angular.copy(item.type.dataType), type: 'number'});
                angular.forEach(item.statistics, function (data) {
                    if (!mapObj[data.date]) {
                        mapObj[data.date] = {date: data.date};
                        mapObj[data.date].values = [];
                        testDate = new Date(data.date);
                        if (testDate < vm.minDate) {
                            vm.minDate = testDate;
                        }
                        if (testDate > vm.maxDate) {
                            vm.maxDate = testDate;
                        }
                    }
                    mapObj[data.date].values.push(data.value);
                });
            });
            vm.safeRows = [];
            angular.forEach(mapObj, function (row) {
                c = [{v: new Date(row.date)}];
                c = c.concat(row.values.map(function (val) { return {v: val }; }))
                vm.safeRows.push({c: c});
            });
            vm.startDate = angular.copy(vm.minDate);
            vm.endDate = angular.copy(vm.maxDate);
        }
    }
})();

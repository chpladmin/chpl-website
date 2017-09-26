(function () {
    'use strict';

    describe('the Charts component controller', function () {

        var $controller, $log, $q, mock, networkService, scope, vm;
        mock = {
            types: [
                {id: 0, dataType: 'Total Number of Unique Products over time'},
                {id: 1, dataType: 'Total Number of Unique Products w/ Active Listings Over Time'},
                {id: 2, dataType: 'Total Number of Unique Products w/ Active 2014 Listings'},
                {id: 3, dataType: 'Total Number of Unique Products w/ Active 2015 Listings'},
            ],
            stats: [
                {date: 'Fri Apr 08 2016', value: 2302},
                {date: 'Fri Apr 15 2016', value: 2303},
                {date: 'Fri Apr 22 2016', value: 2303},
                {date: 'Fri Apr 29 2016', value: 2307},
                {date: 'Fri May 06 2016', value: 2312},
                {date: 'Fri May 13 2016', value: 2312},
                {date: 'Fri May 20 2016', value: 2313},
                {date: 'Fri May 27 2016', value: 2315},
                {date: 'Fri Jun 03 2016', value: 2315},
                {date: 'Fri Jun 10 2016', value: 2315},
                {date: 'Fri Jun 17 2016', value: 2317},
                {date: 'Fri Jun 24 2016', value: 2321},
                {date: 'Fri Jul 01 2016', value: 2322},
                {date: 'Fri Jul 08 2016', value: 2325},
                {date: 'Fri Jul 15 2016', value: 2325},
                {date: 'Fri Jul 22 2016', value: 2326},
                {date: 'Fri Jul 29 2016', value: 2329},
                {date: 'Fri Aug 05 2016', value: 2332},
                {date: 'Fri Aug 12 2016', value: 2334},
                {date: 'Fri Aug 19 2016', value: 2337},
                {date: 'Fri Aug 26 2016', value: 2338},
                {date: 'Fri Sep 02 2016', value: 2339},
                {date: 'Fri Sep 09 2016', value: 2339},
                {date: 'Fri Sep 16 2016', value: 2340},
                {date: 'Fri Sep 23 2016', value: 2343},
                {date: 'Fri Sep 30 2016', value: 2343},
                {date: 'Fri Oct 07 2016', value: 2359},
                {date: 'Fri Oct 14 2016', value: 2360},
                {date: 'Fri Oct 21 2016', value: 2360},
                {date: 'Fri Oct 28 2016', value: 2362},
                {date: 'Fri Nov 04 2016', value: 2362},
                {date: 'Fri Nov 11 2016', value: 2365},
                {date: 'Fri Nov 18 2016', value: 2367},
                {date: 'Fri Nov 25 2016', value: 2373},
                {date: 'Fri Dec 02 2016', value: 2374},
                {date: 'Fri Dec 09 2016', value: 2376},
                {date: 'Fri Dec 16 2016', value: 2378},
                {date: 'Fri Dec 23 2016', value: 2384},
                {date: 'Fri Dec 30 2016', value: 2391},
                {date: 'Fri Jan 06 2017', value: 2393},
                {date: 'Fri Jan 13 2017', value: 2397},
                {date: 'Fri Jan 20 2017', value: 2398},
                {date: 'Fri Jan 27 2017', value: 2400},
                {date: 'Fri Feb 03 2017', value: 2404},
                {date: 'Fri Feb 10 2017', value: 2406},
                {date: 'Fri Feb 17 2017', value: 2408},
                {date: 'Fri Feb 24 2017', value: 2409},
                {date: 'Fri Mar 03 2017', value: 2410},
                {date: 'Fri Mar 10 2017', value: 2412},
                {date: 'Fri Mar 17 2017', value: 2415},
                {date: 'Fri Mar 24 2017', value: 2415},
                {date: 'Fri Mar 31 2017', value: 2415},
                {date: 'Fri Apr 07 2017', value: 2416},
                {date: 'Fri Apr 14 2017', value: 2417},
                {date: 'Fri Apr 21 2017', value: 2420},
                {date: 'Fri Apr 28 2017', value: 2420},
                {date: 'Fri May 05 2017', value: 2420},
                {date: 'Fri May 12 2017', value: 2420},
                {date: 'Fri May 19 2017', value: 2422},
                {date: 'Fri May 26 2017', value: 2423},
                {date: 'Fri Jun 02 2017', value: 2426},
                {date: 'Fri Jun 09 2017', value: 2428},
                {date: 'Fri Jun 16 2017', value: 2429},
                {date: 'Fri Jun 23 2017', value: 2431},
                {date: 'Fri Jun 30 2017', value: 2433},
                {date: 'Fri Jul 07 2017', value: 2434},
                {date: 'Fri Jul 14 2017', value: 2439},
                {date: 'Fri Jul 21 2017', value: 2439},
                {date: 'Fri Jul 28 2017', value: 2443},
                {date: 'Fri Aug 11 2017', value: 2443},
                {date: 'Fri Aug 04 2017', value: 2443},
            ],
        };

        beforeEach(function () {
            module('chpl.charts', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getStatisticTypes = jasmine.createSpy('getStatisticTypes');
                    $delegate.getStatistics = jasmine.createSpy('getStatistics');
                    return $delegate;
                });
            });

            mock.statistics = [];
            for (var i = 0; i < mock.types.length; i++) {
                mock.statistics.push({type: angular.copy(mock.types[i]), statistics: angular.copy(mock.stats)});
            }
            inject(function (_$controller_, _$log_, _$q_, $rootScope, _networkService_) {
                $controller = _$controller_;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.getStatisticTypes.and.returnValue($q.when(mock.types));
                networkService.getStatistics.and.returnValue($q.when(mock.statistics));

                scope = $rootScope.$new();
                vm = $controller('ChartsController', {
                    $scope: scope,
                })
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + angular.toJson($log.debug.logs));
                /* eslint-enable no-console,angular/log */
            }
        });

        it('should exist', function () {
            expect(vm).toBeDefined();
        });

        describe('during load', function () {
            it('should get all of the statistics', function () {
                expect(networkService.getStatistics).toHaveBeenCalled();
                expect(vm.statistics.length).toBe(mock.types.length);
            });

            it('should build the columns', function () {
                expect(vm.chart.data.cols.length).toBe(5);
                expect(vm.chart.data.cols[0]).toEqual({label: 'Date', type: 'date' });
                expect(vm.chart.data.cols[1]).toEqual({label: mock.types[0].dataType, type: 'number'});
            });

            it('should build the rows', function () {
                expect(vm.chart.data.rows.length).toBe(71);
                expect(vm.chart.data.rows[0]).toEqual({c: [{v: new Date('Fri Apr 08 2016')},{v: 2302},{v: 2302},{v: 2302},{v: 2302}]});
            });
        });

        describe('when filtering on dates', function () {
            it('should know what the min & max dates are', function () {
                expect(vm.minDate).toEqual(new Date('Fri Apr 08 2016'));
                expect(vm.maxDate).toEqual(new Date('Fri Aug 11 2017'));
            });

            it('should reduce the data set when a start date is chosen', function () {
                var initLength = vm.chart.data.rows.length;
                vm.startDate = new Date('Sat Aug 13 2016');
                vm.applyFilter();
                expect(vm.chart.data.rows.length).toBeLessThan(initLength);
            });

            it('should reduce the data set when an end date is chosen', function () {
                var initLength = vm.chart.data.rows.length;
                vm.endDate = new Date('Sat Aug 13 2016');
                vm.applyFilter();
                expect(vm.chart.data.rows.length).toBeLessThan(initLength);
            });
        });

        describe('when toggling serieses', function () {
            it('should do nothing if data points are clicked on', function () {
                var orig = angular.copy(vm.chart);
                vm.toggleSeries({row: 3, column: 1});
                expect(vm.chart).toEqual(orig);
            });

            describe('from active', function () {
                it('should modify the column to use a calculation function', function () {
                    vm.toggleSeries({row: null, column: 1});
                    expect(vm.chart.view.columns[1]).toEqual({
                        label: jasmine.any(String),
                        type: 'number',
                        calc: jasmine.any(Function),
                    });
                });

                it('should use the calc function to return null for all values', function () {
                    vm.toggleSeries({row: null, column: 1});
                    expect(vm.chart.view.columns[1].calc()).toEqual(null);
                });

                it('should make the newly inactive legend "grey"', function () {
                    vm.toggleSeries({row: null, column: 1});
                    expect(vm.chart.options.colors[0]).toBe('#ccc');
                });
            });

            describe('to active', function () {
                it('should set the column back to normal', function () {
                    vm.toggleSeries({row: null, column: 1});
                    vm.toggleSeries({row: null, column: 1});
                    expect(vm.chart.view.columns[1]).toBe(1);
                });

                it('should restore the legend color to it\'s original state', function () {
                    vm.toggleSeries({row: null, column: 1});
                    vm.toggleSeries({row: null, column: 1});
                    expect(vm.chart.options.colors[0]).toBe(vm.chart.options.defaultColors[0]);
                });
            });
        });
    });
})();

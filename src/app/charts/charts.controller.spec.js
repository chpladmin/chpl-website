(function () {
    'use strict';

    describe('the Charts component controller', function () {

        var $controller, $log, $q, mock, networkService, scope, vm;
        mock = {
            'sedParticipantStatisticsCounts': [
                {'id': 187,'sedCount': 7,'participantCount': 130,'creationDate': 1520357057186,'deleted': false,'lastModifiedDate': 1520357057186,'lastModifiedUser': -3},
                {'id': 188,'sedCount': 2,'participantCount': 67,'creationDate': 1520357057200,'deleted': false,'lastModifiedDate': 1520357057200,'lastModifiedUser': -3},
                {'id': 189,'sedCount': 2,'participantCount': 72,'creationDate': 1520357057202,'deleted': false,'lastModifiedDate': 1520357057202,'lastModifiedUser': -3},
                {'id': 190,'sedCount': 61,'participantCount': 10,'creationDate': 1520357057204,'deleted': false,'lastModifiedDate': 1520357057204,'lastModifiedUser': -3},
                {'id': 191,'sedCount': 11,'participantCount': 11,'creationDate': 1520357057205,'deleted': false,'lastModifiedDate': 1520357057205,'lastModifiedUser': -3},
                {'id': 192,'sedCount': 4,'participantCount': 12,'creationDate': 1520357057207,'deleted': false,'lastModifiedDate': 1520357057207,'lastModifiedUser': -3},
                {'id': 193,'sedCount': 2,'participantCount': 13,'creationDate': 1520357057209,'deleted': false,'lastModifiedDate': 1520357057209,'lastModifiedUser': -3},
                {'id': 194,'sedCount': 1,'participantCount': 14,'creationDate': 1520357057210,'deleted': false,'lastModifiedDate': 1520357057210,'lastModifiedUser': -3},
                {'id': 195,'sedCount': 3,'participantCount': 15,'creationDate': 1520357057212,'deleted': false,'lastModifiedDate': 1520357057212,'lastModifiedUser': -3},
                {'id': 196,'sedCount': 7,'participantCount': 16,'creationDate': 1520357057213,'deleted': false,'lastModifiedDate': 1520357057213,'lastModifiedUser': -3},
                {'id': 197,'sedCount': 1,'participantCount': 81,'creationDate': 1520357057215,'deleted': false,'lastModifiedDate': 1520357057215,'lastModifiedUser': -3},
                {'id': 198,'sedCount': 6,'participantCount': 83,'creationDate': 1520357057216,'deleted': false,'lastModifiedDate': 1520357057216,'lastModifiedUser': -3},
                {'id': 199,'sedCount': 9,'participantCount': 20,'creationDate': 1520357057218,'deleted': false,'lastModifiedDate': 1520357057218,'lastModifiedUser': -3},
                {'id': 200,'sedCount': 1,'participantCount': 21,'creationDate': 1520357057219,'deleted': false,'lastModifiedDate': 1520357057219,'lastModifiedUser': -3},
                {'id': 201,'sedCount': 3,'participantCount': 22,'creationDate': 1520357057221,'deleted': false,'lastModifiedDate': 1520357057221,'lastModifiedUser': -3},
                {'id': 202,'sedCount': 3,'participantCount': 23,'creationDate': 1520357057222,'deleted': false,'lastModifiedDate': 1520357057222,'lastModifiedUser': -3},
                {'id': 203,'sedCount': 4,'participantCount': 24,'creationDate': 1520357057224,'deleted': false,'lastModifiedDate': 1520357057224,'lastModifiedUser': -3},
                {'id': 204,'sedCount': 3,'participantCount': 25,'creationDate': 1520357057226,'deleted': false,'lastModifiedDate': 1520357057226,'lastModifiedUser': -3},
                {'id': 205,'sedCount': 1,'participantCount': 26,'creationDate': 1520357057227,'deleted': false,'lastModifiedDate': 1520357057227,'lastModifiedUser': -3},
                {'id': 206,'sedCount': 1,'participantCount': 93,'creationDate': 1520357057228,'deleted': false,'lastModifiedDate': 1520357057228,'lastModifiedUser': -3},
                {'id': 207,'sedCount': 2,'participantCount': 159,'creationDate': 1520357057229,'deleted': false,'lastModifiedDate': 1520357057229,'lastModifiedUser': -3},
                {'id': 208,'sedCount': 2,'participantCount': 31,'creationDate': 1520357057230,'deleted': false,'lastModifiedDate': 1520357057230,'lastModifiedUser': -3},
                {'id': 209,'sedCount': 2,'participantCount': 32,'creationDate': 1520357057231,'deleted': false,'lastModifiedDate': 1520357057231,'lastModifiedUser': -3},
                {'id': 210,'sedCount': 2,'participantCount': 34,'creationDate': 1520357057233,'deleted': false,'lastModifiedDate': 1520357057233,'lastModifiedUser': -3},
                {'id': 211,'sedCount': 4,'participantCount': 35,'creationDate': 1520357057234,'deleted': false,'lastModifiedDate': 1520357057234,'lastModifiedUser': -3},
                {'id': 212,'sedCount': 2,'participantCount': 104,'creationDate': 1520357057235,'deleted': false,'lastModifiedDate': 1520357057235,'lastModifiedUser': -3},
                {'id': 213,'sedCount': 1,'participantCount': 172,'creationDate': 1520357057236,'deleted': false,'lastModifiedDate': 1520357057236,'lastModifiedUser': -3},
                {'id': 214,'sedCount': 1,'participantCount': 44,'creationDate': 1520357057237,'deleted': false,'lastModifiedDate': 1520357057237,'lastModifiedUser': -3},
                {'id': 215,'sedCount': 2,'participantCount': 113,'creationDate': 1520357057239,'deleted': false,'lastModifiedDate': 1520357057239,'lastModifiedUser': -3},
                {'id': 216,'sedCount': 2,'participantCount': 51,'creationDate': 1520357057240,'deleted': false,'lastModifiedDate': 1520357057240,'lastModifiedUser': -3},
                {'id': 217,'sedCount': 3,'participantCount': 56,'creationDate': 1520357057241,'deleted': false,'lastModifiedDate': 1520357057241,'lastModifiedUser': -3},
                {'id': 218,'sedCount': 1,'participantCount': 121,'creationDate': 1520357057243,'deleted': false,'lastModifiedDate': 1520357057243,'lastModifiedUser': -3},
                {'id': 219,'sedCount': 1,'participantCount': 124,'creationDate': 1520357057244,'deleted': false,'lastModifiedDate': 1520357057244,'lastModifiedUser': -3},
                {'id': 220,'sedCount': 1,'participantCount': 255,'creationDate': 1520357057246,'deleted': false,'lastModifiedDate': 1520357057246,'lastModifiedUser': -3},
            ],
        };

        beforeEach(function () {
            module('chpl.charts', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getSedParticipantStatisticsCount = jasmine.createSpy('getSedParticipantStatisticsCount');
                    //$delegate.getStatistics = jasmine.createSpy('getStatistics');
                    return $delegate;
                });
            });

            /*
            mock.statistics = [];
            for (var i = 0; i < mock.types.length; i++) {
                mock.statistics.push({type: angular.copy(mock.types[i]), statistics: angular.copy(mock.stats)});
            }
            */

            inject(function (_$controller_, _$log_, _$q_, $rootScope, _networkService_) {
                $controller = _$controller_;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.getSedParticipantStatisticsCount.and.returnValue($q.when(mock.sedParticipantStatisticsCounts));
                //networkService.getStatistics.and.returnValue($q.when(mock.statistics));

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

        /*
        it('should exist', function () {
            expect(vm).toBeDefined();
        });

        describe('during load', function () {
            it('should get all of the sedParticipantStatisticsCounts', function () {
                expect(networkService.sedParticipantStatisticsCounts).toHaveBeenCalled();
                expect(vm.sedParticipantStatisticsCounts.length).toBe(mock.sedParticipantStatisticsCounts.length);
            });

            it('should build the columns', function () {
                expect(vm.charts.uniqueProducts.data.cols.length).toBe(5);
                expect(vm.charts.uniqueProducts.data.cols[0]).toEqual({label: 'Date', type: 'date' });
                expect(vm.charts.uniqueProducts.data.cols[1]).toEqual({label: mock.types[0].dataType, type: 'number'});
            });

            it('should build the rows', function () {
                expect(vm.charts.uniqueProducts.data.rows.length).toBe(71);
                expect(vm.charts.uniqueProducts.data.rows[0]).toEqual({c: [{v: new Date('Fri Apr 08 2016')},{v: 2302},{v: 2302},{v: 2302},{v: 2302}]});
            });
        });
        */
    });
})();

(function () {
    'use strict';

    angular.module('chpl.charts')
        .controller('ChartsController', ChartsController);

    /** @ngInclude */
    function ChartsController ($log, networkService) {
        var vm = this;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            networkService.getSedParticipantStatisticsCount().then(function (data) {
                vm.charts = {
                    sedParticipantCounts: {
                        type: 'ColumnChart',
                        data: {
                            cols: [
                                { label: 'Number of SED Test Participants Used', type: 'number'},
                                { label: 'Number of 2015 Edition CHPL Listings', type: 'number'},
                            ],
                            rows: _getSedParticipantCountDataInChartFormat(data),
                        },
                        options: {
                            title: 'Number of Safety Enhanced Design Test Participant',
                            hAxis: {
                                title: 'Number of SED Test Participants Used',
                                minValue: 0,
                            },
                            vAxis: {
                                scaleType: 'mirrorLog',
                                title: 'Number of 2015 Edition CHPL Listings',
                            },
                        },
                    },
                }
            });
        }

        function _getSedParticipantCountDataInChartFormat (data) {
            data.sedParticipantStatisticsCounts.sort(function (a, b) {
                return parseInt(a.participantCount, 10) - parseInt(b.participantCount, 10);
            });
            return data.sedParticipantStatisticsCounts.map(function (obj) {
                return {c: [{ v: obj.participantCount},{v: obj.sedCount}]};
            });
        }
    }
})();

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
                                { label: 'Participants', type: 'number'},
                                { label: 'SED Count', type: 'number'},
                            ],
                            rows: _getSedParticipantCountDataInChartFormat(data),
                        },
                        options: {
                            title: 'SED Count by Participant Count',
                            hAxis: {
                                title: 'Participant Count',
                                minValue: 0,
                            },
                            vAxis: {
                                scaleType: 'mirrorLog',
                                title: 'SED Count',
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

(function () {
    'use strict';

    angular.module('chpl.charts')
        .controller('ChartsController', ChartsController);

    /** @ngInclude */
    function ChartsController ($log, networkService) {
        var vm = this;

        prepareSedParticipantCountChart();

        ////////////////////////////////////////////////////////////////////

        function prepareSedParticipantCountChart() {
            networkService.getSedParticipantStatisticsCount().then(function (data) {
                vm.charts = {
                    sedParticipantCounts: {
                        type: "ColumnChart",
                        data: {
                            cols: [
                                { label: 'Participants', type: 'number'},
                                { label: 'SED Count', type: 'number'},
                            ],
                            rows: getSedParticipantCountDataInChartFormat(data),
                        },
                        options: {
                            title: 'SED Count by Participant Count',
                            hAxis: {
                                title: 'Participant Count',
                                minValue: 0
                              },
                            vAxis: {
                                scaleType: 'mirrorLog',
                                title: 'SED Count'
                             }
                        }
                    }
                }
            });
        }

        function getSedParticipantCountDataInChartFormat(data) {
            data.sedParticipantStatisticsCounts.sort(function(a, b) {
                return parseInt(a.participantCount) - parseInt(b.participantCount);
            });
            return data.sedParticipantStatisticsCounts.map(obj =>  {
                return {c: [{ v: obj.participantCount},{v: obj.sedCount}]};
            });
        }
    }
})();

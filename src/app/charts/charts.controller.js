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
            _createSedParticipantCountChart();
            _createParticipantGenderCountChart();
            _createParticipantAgeCountChart();
            _createParticipantEducationCountChart();
            _createParticipantProfessionalExperienceCountChart();
            _createParticipantComputerExperienceCountChart();
            _createParticipantProductExperienceCountChart();
        }

        function _createSedParticipantCountChart () {
            networkService.getSedParticipantStatisticsCount().then(function (data) {
                vm.sedParticipantCounts = {
                    type: 'ColumnChart',
                    data: {
                        cols: [
                            { label: 'Number of SED Test Participants Used', type: 'number'},
                            { label: 'Number of 2015 Edition CHPL Listings', type: 'number'},
                        ],
                        rows: _getSedParticipantCountDataInChartFormat(data),
                    },
                    options: {
                        title: 'Number of Safety Enhanced Design Test Participants',
                        hAxis: {
                            title: 'Number of SED Test Participants Used',
                            minValue: 0,
                        },
                        vAxis: {
                            scaleType: 'mirrorLog',
                            title: 'Number of 2015 Edition CHPL Listings',
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

        function _createParticipantGenderCountChart () {
            networkService.getParticipantGenderStatistics().then(function (data) {
                vm.participantGenderCounts = {
                    type: 'PieChart',
                    data: {
                        cols: [
                            { label: 'Genders', type: 'string'},
                            { label: 'Counts', type: 'number'},
                        ],
                        rows: _getParticipantGenderCountDataInChartFormat(data),
                    },
                    options: {
                        title: 'Safety Enhanced Design Test Participants by Gender',
                        sliceVisibilityThreshold: 0,
                    },
                }
            });
        }

        function _getParticipantGenderCountDataInChartFormat (data) {
            var genderData = [
                {c: [{ v: 'Male'},{v: data.maleCount}]}, 
                {c: [{ v: 'Female'},{v: data.femaleCount}]},
                {c: [{ v: 'Unknown'},{v: data.unknownCOunt}]},
            ];
            return genderData;
        }

        function _createParticipantAgeCountChart () {
            networkService.getParticipantAgeStatistics().then(function (data) {
                vm.participantAgeCounts = {
                    type: 'PieChart',
                    data: {
                        cols: [
                            { label: 'Age Ranges', type: 'string'},
                            { label: 'Counts', type: 'number'},
                        ],
                        rows: _getParticipantAgeCountDataInChartFormat(data),
                    },
                    options: {
                        title: 'Safety Enhanced Design Test Participants by Age',
                    },
                }
            });
        }

        function _getParticipantAgeCountDataInChartFormat (data) {
            data.participantAgeStatistics.sort(function (a, b) {
                return parseInt(a.ageRange, 10) - parseInt(b.ageRange, 10);
            });
            return data.participantAgeStatistics.map(function (obj) {
                return {c: [{ v: obj.ageRange},{v: obj.ageCount}]};
            });
        }

        function _createParticipantEducationCountChart () {
            networkService.getParticipantEducationStatistics().then(function (data) {
                vm.participantEducationCounts = {
                    type: 'PieChart',
                    data: {
                        cols: [
                            { label: 'Education Level', type: 'string'},
                            { label: 'Counts', type: 'number'},
                        ],
                        rows: _getParticipantEducationCountDataInChartFormat(data),
                    },
                    options: {
                        title: 'Safety Enhanced Design Test Participants by Education Level',
                    },
                }
            });
        }

        function _getParticipantEducationCountDataInChartFormat (data) {
            data.participantEducationStatistics.sort(function (a, b) {
                return parseInt(a.educationRange, 10) - parseInt(b.educationRange, 10);
            });
            return data.participantEducationStatistics.map(function (obj) {
                return {c: [{ v: obj.education},{v: obj.educationCount}]};
            });
        }

        function _createParticipantProfessionalExperienceCountChart () {
            networkService.getParticipantProfessionalExperienceStatistics().then(function (data) {
                vm.participantProfessionalExperienceCounts = {
                    type: 'ColumnChart',
                    data: {
                        cols: [
                            { label: 'Years Professional Experience', type: 'number'},
                            { label: 'Number of SED Test Participants ', type: 'number'},
                        ],
                        rows: _getParticipantExperienceCountDataInChartFormat(data),
                    },
                    options: {
                        title: 'Years of Professional Experience for Safety Enhanced Design Test Participants',
                        vAxis: {
                            title: 'Number of SED Test Participants',
                            minValue: 0,
                        },
                        hAxis: {
                            minValue: 0,
                            title: 'Years Professional Experience',
                            gridlines: {
                                count: 6,
                            },
                        },
                    },
                }
            });
        }

        function _createParticipantComputerExperienceCountChart () {
            networkService.getParticipantComputerExperienceStatistics().then(function (data) {
                vm.participantComputerExperienceCounts = {
                    type: 'ColumnChart',
                    data: {
                        cols: [
                            { label: 'Years Computer Experience', type: 'number'},
                            { label: 'Number of SED Test Participants ', type: 'number'},
                        ],
                        rows: _getParticipantExperienceCountDataInChartFormat(data),
                    },
                    options: {
                        title: 'Years of Computer Experience for Safety Enhanced Design Test Participants',
                        vAxis: {
                            title: 'Number of SED Test Participants',
                            minValue: 0,
                        },
                        hAxis: {
                            minValue: 0,
                            title: 'Years Computer Experience',
                            gridlines: {
                                count: 6,
                            },
                        },
                    },
                }
            });
        }

        function _createParticipantProductExperienceCountChart () {
            networkService.getParticipantProductExperienceStatistics().then(function (data) {
                vm.participantProductExperienceCounts = {
                    type: 'ColumnChart',
                    data: {
                        cols: [
                            { label: 'Years Product Experience', type: 'number'},
                            { label: 'Number of SED Test Participants ', type: 'number'},
                        ],
                        rows: _getParticipantExperienceCountDataInChartFormat(data),
                    },
                    options: {
                        title: 'Years of Product Experience for Safety Enhanced Design Test Participants',
                        vAxis: {
                            title: 'Number of SED Test Participants',
                            minValue: 0,
                        },
                        hAxis: {
                            minValue: 0,
                            title: 'Years Product Experience',
                            gridlines: {
                                count: 7,
                            },
                        },
                    },
                }
            });
        }

        function _getParticipantExperienceCountDataInChartFormat (data) {
            //Calculate the years exp based on the months
            data.participantExperienceStatistics.map(function (obj) {
                obj.experienceYears = Math.floor(obj.experienceMonths / 12);
                return obj;
            });

            //Sum participants based on years experience
            //var experienceMap = new Map();
            var experienceMap = {};
            angular.forEach(data.participantExperienceStatistics, function (value) {
                var count = value.participantCount;
                //if (experienceMap.has(value.experienceYears)) {
                if (value.experienceYears in experienceMap) {
                    count = experienceMap[value.experienceYears] + count;
                }
                experienceMap[value.experienceYears] = count;
            })

            //var experienceSummedByYear = Array.from(experienceMap);
            //Convert to an array of arrays
            var experienceSummedByYear = Object.keys(experienceMap).map(function (key) {
                return [key, experienceMap[key]];
            })

            //Sort based on years experience
            experienceSummedByYear.sort(function (a, b) {
                return parseInt(a[0], 10) - parseInt(b[0], 10);
            });

            //Format the data for the chart
            return experienceSummedByYear.map(function (obj) {
                return {c: [{ v: obj[0]},{v: obj[1]}]};
            });
        }
    }
})();

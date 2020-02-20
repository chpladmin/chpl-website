(function () {
    'use strict';

    angular.module('chpl.charts')
        .controller('ChartsController', ChartsController);

    /** @ngInclude */
    function ChartsController ($log, networkService, utilService) {
        var vm = this;

        vm.updateYAxis = updateYAxis;
        vm.updateChartStack = updateChartStack;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.nonconformityTypes = [
                'All',
                2014,
                2015,
                'Program',
            ];
            vm.chartState = {
                isStacked: 'false',
                yAxis: '',
                listingCountType: '1',
                productEdition: 2014,
                nonconformityCountType: 'All',
                tab: 'product',
            };
            _createCriterionProductCountChart();
            _createIncumbentDevelopersCountChart();
            _createListingCountCharts();
            _createNonconformityCountChart();
            _createSedParticipantCountChart();
            _createParticipantGenderCountChart();
            _createParticipantAgeCountChart();
            _createParticipantEducationCountChart();
            _createParticipantProfessionalExperienceCountChart();
            _createParticipantComputerExperienceCountChart();
            _createParticipantProductExperienceCountChart();
        }

        function updateChartStack () {
            Object.keys(vm.listingCount.edition).forEach(function (key) {
                vm.listingCount.edition[key].chart.options.isStacked = vm.chartState.isStacked;
            });
            Object.keys(vm.listingCount.class).forEach(function (key) {
                vm.listingCount.class[key].chart.options.isStacked = vm.chartState.isStacked;
            });
        }

        function updateYAxis () {
            Object.values(vm.nonconformityCounts).forEach(function (value) {
                value.options.vAxis.scaleType = vm.chartState.yAxis;
            });
        }

        ////////////////////////////////////////////////////////////////////

        function _createCriterionProductCountChart () {
            networkService.getCriterionProductStatistics().then(function (data) {
                vm.criterionProductCounts = {
                    2014: {
                        type: 'BarChart',
                        data: {
                            cols: [
                                { label: 'Certification Criteria', type: 'string'},
                                { label: 'Number of Unique Products', type: 'number'},
                                { type: 'string', role: 'tooltip'},
                            ],
                            rows: _getCriterionProductCountDataInChartFormat(data, 2014),
                        },
                        options: {
                            tooltip: {isHtml: true},
                            animation: {
                                duration: 1000,
                                easing: 'inAndOut',
                                startup: true,
                            },
                            chartArea: { top: 64, height: '90%' },
                            title: 'Number of 2014 Edition Unique Products certified to specific Certification Criteria',
                        },
                    },
                    2015: {
                        type: 'BarChart',
                        data: {
                            cols: [
                                { label: 'Certification Criteria', type: 'string'},
                                { label: 'Number of Unique Products', type: 'number'},
                                { type: 'string', role: 'tooltip'},
                            ],
                            rows: _getCriterionProductCountDataInChartFormat(data, 2015),
                        },
                        options: {
                            tooltip: {isHtml: true},
                            animation: {
                                duration: 1000,
                                easing: 'inAndOut',
                                startup: true,
                            },
                            chartArea: { top: 64, height: '90%' },
                            title: 'Number of 2015 Edition Unique Products certified to specific Certification Criteria',
                        },
                    },
                }
            });
        }

        function _getCriterionProductCountDataInChartFormat (data, edition) {
            return data.criterionProductStatisticsResult.filter(obj => obj.criterion.number.indexOf('170.3' + (edition + '').substring(2)) >= 0)
                .sort((a, b) => utilService.sortCert(a.criterion.number) - utilService.sortCert(b.criterion.number))
                .map(obj => {
                    return {c: [{
                        v: obj.criterion.number + (obj.criterion.title.indexOf('Cures Update') > 0 ? ' (Cures Update)' : ''),
                    },{v: obj.productCount}, {v: 'Name: ' + obj.criterion.title + '\n Count: ' + obj.productCount}]};
                });
        }

        function _createIncumbentDevelopersCountChart () {
            networkService.getIncumbentDevelopersStatistics().then(function (data) {
                vm.incumbentDevelopersCounts =
                    data.incumbentDevelopersStatisticsResult.sort(function (a, b) {
                        if (a.oldCertificationEdition.certificationEditionId === b.oldCertificationEdition.certificationEditionId) {
                            return a.newCertificationEdition.certificationEditionId - b.newCertificationEdition.certificationEditionId;
                        } else {
                            return a.oldCertificationEdition.certificationEditionId - b.oldCertificationEdition.certificationEditionId;
                        }
                    }).map(function (obj) {
                        var chart = {
                            type: 'PieChart',
                            data: {
                                cols: [
                                    { label: 'Developers', type: 'string'},
                                    { label: 'Counts', type: 'number'},
                                ],
                                rows: [
                                    {c: [{ v: 'New Developers'}, {v: obj.newCount}]},
                                    {c: [{ v: 'Incumbent Developers'}, {v: obj.incumbentCount}]},
                                ],
                            },
                            options: {
                                title: 'New vs. Incumbent Developers by Edition, ' + obj.oldCertificationEdition.year + ' to ' + obj.newCertificationEdition.year,
                            },
                        };
                        return chart;
                    });
            })
        }

        function _createListingCountCharts () {
            networkService.getListingCountStatistics().then(function (data) {
                vm.listingCount = {
                    edition: {},
                    class: {},
                };
                data.statisticsResult.forEach(function (obj) {
                    vm.listingCount.edition['' + obj.certificationStatus.id] = {
                        name: obj.certificationStatus.name,
                        chart: _createListingCountChartEdition(data, obj.certificationStatus.name),
                    };
                    vm.listingCount.class['' + obj.certificationStatus.id] = {
                        name: obj.certificationStatus.name,
                        chart: _createListingCountChartClass(data, obj.certificationStatus.name),
                    };
                });
                vm.listingCountTypes = Object.keys(vm.listingCount.edition)
                    .map(function (key) {
                        return {
                            id: key,
                            name: vm.listingCount.edition[key].name,
                        }
                    });
            });
        }

        function _createListingCountChartEdition (data, status) {
            return {
                type: 'ColumnChart',
                data: {
                    cols: [
                        { label: 'Certification Edition', type: 'string'},
                        { label: 'Number of Developers with "' + status + '" Listings', type: 'number'},
                        { label: 'Number of Products with "' + status + '" Listings', type: 'number'},
                    ],
                    rows: _getListingCountChartEditionData(data, status),
                },
                options: {
                    animation: {
                        duration: 1000,
                        easing: 'inAndOut',
                        startup: true,
                    },
                    title: 'Number of Developers and Products with "' + status + '" Listings',
                    hAxis: {
                        title: 'Certification Edition',
                    },
                    vAxis: {
                        title: 'Number of Developers and Products with "' + status + '" Listings',
                        minValue: 0,
                    },
                },
            }
        }

        function _createListingCountChartClass (data, status) {
            return {
                type: 'ColumnChart',
                data: {
                    cols: [
                        { label: 'Number of Developers and Products with "' + status + '" Listings', type: 'string'},
                        { label: 'Certification Edition 2014', type: 'number'},
                        { label: 'Certification Edition 2015', type: 'number'},
                    ],
                    rows: _getListingCountChartClassData(data, status),
                },
                options: {
                    animation: {
                        duration: 1000,
                        easing: 'inAndOut',
                        startup: true,
                    },
                    title: 'Number of Developers and Products with "' + status + '" Listings',
                    hAxis: {
                        title: 'Developer / Product',
                    },
                    vAxis: {
                        title: 'Number of Developers and Products with "' + status + '" Listings',
                        minValue: 0,
                    },
                },
            }
        }

        function _getListingCountChartEditionData (data, status) {
            return data.statisticsResult.filter(function (a) {
                return a.certificationStatus.name === status;
            }).map(function (obj) {
                return {c: [
                    { v: obj.certificationEdition.year },
                    { v: obj.developerCount },
                    { v: obj.productCount},
                ]};
            });
        }

        function _getListingCountChartClassData (data, status) {
            var transformedData = {
                developer: {},
                product: {},
            };
            data.statisticsResult.filter(function (a) {
                return a.certificationStatus.name === status;
            }).forEach(function (obj) {
                transformedData.developer[obj.certificationEdition.year] = obj.developerCount;
                transformedData.product[obj.certificationEdition.year] = obj.productCount;
            });
            return [{
                c: [{ v: 'Developer' }]
                    .concat(
                        Object.keys(transformedData.developer)
                            .sort()
                            .map(function (key) {
                                return { v: transformedData.developer[key]}
                            })
                    ),
            },{
                c: [{ v: 'Product' }]
                    .concat(
                        Object.keys(transformedData.product)
                            .sort()
                            .map(function (key) {
                                return { v: transformedData.product[key]}
                            })
                    ),
            }];
        }

        function _createNonconformityCountChart () {
            networkService.getNonconformityStatisticsCount().then(function (data) {
                vm.nonconformityCounts = {
                    'All': {
                        type: 'ColumnChart',
                        data: {
                            cols: [
                                { label: 'All Certification Criteria and Program Requirements Surveilled', type: 'string'},
                                { label: 'Number of Non-Conformities', type: 'number'},
                            ],
                            rows: _getNonconformityCountDataInChartFormat(data, 'All'),
                        },
                        options: {
                            animation: {
                                duration: 1000,
                                easing: 'inAndOut',
                                startup: true,
                            },
                            title: 'Number of Non-Conformities by Certification Criteria and Program Requirements Surveilled',
                            hAxis: {
                                title: 'All Certification Criteria and Program Requirements Surveilled',
                                minValue: 0,
                            },
                            vAxis: {
                                scaleType: vm.chartState.yAxis,
                                title: 'Number of Non-Conformities',
                                minValue: 0,
                            },
                        },
                    },
                    2014: {
                        type: 'ColumnChart',
                        data: {
                            cols: [
                                { label: '2014 Certification Criteria and Program Requirements Surveilled', type: 'string'},
                                { label: 'Number of Non-Conformities', type: 'number'},
                            ],
                            rows: _getNonconformityCountDataInChartFormat(data, 2014),
                        },
                        options: {
                            animation: {
                                duration: 1000,
                                easing: 'inAndOut',
                                startup: true,
                            },
                            title: 'Number of Non-Conformities by Certification Criteria and Program Requirements Surveilled',
                            hAxis: {
                                title: '2014 Certification Criteria and Program Requirements Surveilled',
                                minValue: 0,
                            },
                            vAxis: {
                                scaleType: vm.chartState.yAxis,
                                title: 'Number of Non-Conformities',
                                minValue: 0,
                            },
                        },
                    },
                    2015: {
                        type: 'ColumnChart',
                        data: {
                            cols: [
                                { label: '2015 Certification Criteria and Program Requirements Surveilled', type: 'string'},
                                { label: 'Number of Non-Conformities', type: 'number'},
                            ],
                            rows: _getNonconformityCountDataInChartFormat(data, 2015),
                        },
                        options: {
                            animation: {
                                duration: 1000,
                                easing: 'inAndOut',
                                startup: true,
                            },
                            title: 'Number of Non-Conformities by Certification Criteria and Program Requirements Surveilled',
                            hAxis: {
                                title: '2015 Certification Criteria and Program Requirements Surveilled',
                                minValue: 0,
                            },
                            vAxis: {
                                scaleType: vm.chartState.yAxis,
                                title: 'Number of Non-Conformities',
                                minValue: 0,
                            },
                        },
                    },
                    'Program': {
                        type: 'ColumnChart',
                        data: {
                            cols: [
                                { label: 'Program Certification Criteria and Program Requirements Surveilled', type: 'string'},
                                { label: 'Number of Non-Conformities', type: 'number'},
                            ],
                            rows: _getNonconformityCountDataInChartFormat(data, 'Program'),
                        },
                        options: {
                            animation: {
                                duration: 1000,
                                easing: 'inAndOut',
                                startup: true,
                            },
                            title: 'Number of Non-Conformities by Certification Criteria and Program Requirements Surveilled',
                            hAxis: {
                                title: 'Program Certification Criteria and Program Requirements Surveilled',
                                minValue: 0,
                            },
                            vAxis: {
                                scaleType: vm.chartState.yAxis,
                                title: 'Number of Non-Conformities',
                                minValue: 0,
                            },
                        },
                    },
                }
            });
        }

        function _getNonconformityCountDataInChartFormat (data, type) {
            return data.nonconformityStatisticsResult.filter(function (obj) {
                switch (type) {
                case 2014:
                    return obj.nonconformityType.indexOf('170.314') >= 0;
                case 2015:
                    return obj.nonconformityType.indexOf('170.315') >= 0;
                case 'Program':
                    return obj.nonconformityType.indexOf('170.523') >= 0 || obj.nonconformityType.indexOf('Other') >= 0;
                case 'All':
                    return true;
                default: false;
                }
            }).sort(function (a, b) {
                return utilService.sortOtherNonconformityTypes(a.nonconformityType) - utilService.sortOtherNonconformityTypes(b.nonconformityType);
            }).map(function (obj) {
                return {c: [{ v: obj.nonconformityType},{v: obj.nonconformityCount}]};
            });
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
                        animation: {
                            duration: 1000,
                            easing: 'inAndOut',
                            startup: true,
                        },
                        title: 'Number of Safety Enhanced Design Test Participants',
                        hAxis: {
                            title: 'Number of SED Test Participants Used',
                            minValue: 0,
                        },
                        vAxis: {
                            scaleType: 'mirrorLog',
                            title: 'Number of 2015 Edition CHPL Listings',
                            minValue: 0,
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
                    },
                }
            });
        }

        function _getParticipantGenderCountDataInChartFormat (data) {
            var genderData = [
                {c: [{ v: 'Male'},{v: data.maleCount}]},
                {c: [{ v: 'Female'},{v: data.femaleCount}]},
                {c: [{ v: 'Unknown'},{v: data.unknownCount}]},
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
                        animation: {
                            duration: 1000,
                            easing: 'inAndOut',
                            startup: true,
                        },
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
                        animation: {
                            duration: 1000,
                            easing: 'inAndOut',
                            startup: true,
                        },
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
                        animation: {
                            duration: 1000,
                            easing: 'inAndOut',
                            startup: true,
                        },
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

export const ChartsComponent = {
    templateUrl: 'chpl.charts/charts.html',
    bindings: {
    },
    controller: class ChartsComponent {
        constructor ($log, networkService, utilService) {
            'ngInject'
            this.$log = $log;
            this.networkService = networkService;
            this.utilService = utilService;
        }

        $onInit () {
            this.nonconformityTypes = [
                'All',
                2014,
                2015,
                'Program',
            ];
            this.chartState = {
                isStacked: 'false',
                yAxis: '',
                listingCountType: '1',
                productEdition: 2014,
                nonconformityCountType: 'All',
                tab: 'product',
            };
            this._createCriterionProductCountChart();
            this._createIncumbentDevelopersCountChart();
            this._createListingCountCharts();
            this._createNonconformityCountChart();
            this.loadSedParticipantCountChart();
            this.loadParticipantGenderCountChart();
            this.loadParticipantAgeCountChart();
            this.loadParticipantEducationCountChart();
            this.loadParticipantProfessionalExperienceCountChart();
            this.loadParticipantComputerExperienceCountChart();
            this.loadParticipantProductExperienceCountChart();
        }

        updateChartStack () {
            let that = this;
            Object.keys(this.listingCount.edition).forEach(function (key) {
                that.listingCount.edition[key].chart.options.isStacked = that.chartState.isStacked;
            });
            Object.keys(this.listingCount.class).forEach(function (key) {
                that.listingCount.class[key].chart.options.isStacked = that.chartState.isStacked;
            });
        }

        updateYAxis () {
            let that = this;
            Object.values(this.nonconformityCounts).forEach(function (value) {
                value.options.vAxis.scaleType = that.chartState.yAxis;
            });
        }

        ////////////////////////////////////////////////////////////////////

        _createCriterionProductCountChart () {
            let that = this;
            this.networkService.getCriterionProductStatistics().then(function (data) {
                that.criterionProductCounts = {
                    2014: {
                        type: 'BarChart',
                        data: {
                            cols: [
                                { label: 'Certification Criteria', type: 'string'},
                                { label: 'Number of Unique Products', type: 'number'},
                                { type: 'string', role: 'tooltip'},
                            ],
                            rows: that._getCriterionProductCountDataInChartFormat(data, 2014),
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
                            rows: that._getCriterionProductCountDataInChartFormat(data, 2015),
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

        _getCriterionProductCountDataInChartFormat (data, edition) {
            let that = this;
            return data.criterionProductStatisticsResult.filter(obj => obj.criterion.number.indexOf('170.3' + (edition + '').substring(2)) >= 0)
                .sort((a, b) => that.utilService.sortCert(a.criterion.number) - that.utilService.sortCert(b.criterion.number))
                .map(obj => {
                    return {c: [{
                        v: obj.criterion.number + (obj.criterion.title.indexOf('Cures Update') > 0 ? ' (Cures Update)' : ''),
                    },{v: obj.productCount}, {v: 'Name: ' + obj.criterion.title + '\n Count: ' + obj.productCount}]};
                });
        }

        _createIncumbentDevelopersCountChart () {
            let that = this;
            this.networkService.getIncumbentDevelopersStatistics().then(function (data) {
                that.incumbentDevelopersCounts =
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

        _createListingCountCharts () {
            let that = this;
            this.networkService.getListingCountStatistics().then(function (data) {
                that.listingCount = {
                    edition: {},
                    class: {},
                };
                data.statisticsResult.forEach(function (obj) {
                    that.listingCount.edition['' + obj.certificationStatus.id] = {
                        name: obj.certificationStatus.name,
                        chart: that._createListingCountChartEdition(data, obj.certificationStatus.name),
                    };
                    that.listingCount.class['' + obj.certificationStatus.id] = {
                        name: obj.certificationStatus.name,
                        chart: that._createListingCountChartClass(data, obj.certificationStatus.name),
                    };
                });
                that.listingCountTypes = Object.keys(that.listingCount.edition)
                    .map(function (key) {
                        return {
                            id: key,
                            name: that.listingCount.edition[key].name,
                        }
                    });
            });
        }

        _createListingCountChartEdition (data, status) {
            return {
                type: 'ColumnChart',
                data: {
                    cols: [
                        { label: 'Certification Edition', type: 'string'},
                        { label: 'Number of Developers with "' + status + '" Listings', type: 'number'},
                        { label: 'Number of Products with "' + status + '" Listings', type: 'number'},
                    ],
                    rows: this._getListingCountChartEditionData(data, status),
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

        _createListingCountChartClass (data, status) {
            return {
                type: 'ColumnChart',
                data: {
                    cols: [
                        { label: 'Number of Developers and Products with "' + status + '" Listings', type: 'string'},
                        { label: 'Certification Edition 2014', type: 'number'},
                        { label: 'Certification Edition 2015', type: 'number'},
                    ],
                    rows: this._getListingCountChartClassData(data, status),
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

        _getListingCountChartEditionData (data, status) {
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

        _getListingCountChartClassData (data, status) {
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

        _createNonconformityCountChart () {
            let that = this;
            this.networkService.getNonconformityStatisticsCount().then(function (data) {
                that.nonconformityCounts = {
                    'All': {
                        type: 'ColumnChart',
                        data: {
                            cols: [
                                { label: 'All Certification Criteria and Program Requirements Surveilled', type: 'string'},
                                { label: 'Number of Non-Conformities', type: 'number'},
                            ],
                            rows: that._getNonconformityCountDataInChartFormat(data, 'All'),
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
                                scaleType: that.chartState.yAxis,
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
                            rows: that._getNonconformityCountDataInChartFormat(data, 2014),
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
                                scaleType: that.chartState.yAxis,
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
                            rows: that._getNonconformityCountDataInChartFormat(data, 2015),
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
                                scaleType: that.chartState.yAxis,
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
                            rows: that._getNonconformityCountDataInChartFormat(data, 'Program'),
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
                                scaleType: that.chartState.yAxis,
                                title: 'Number of Non-Conformities',
                                minValue: 0,
                            },
                        },
                    },
                }
            });
        }

        _getNonconformityCountDataInChartFormat (data, type) {
            let that = this;
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
                return that.utilService.sortOtherNonconformityTypes(a.nonconformityType) - that.utilService.sortOtherNonconformityTypes(b.nonconformityType);
            }).map(function (obj) {
                return {c: [{ v: obj.nonconformityType},{v: obj.nonconformityCount}]};
            });
        }

        loadSedParticipantCountChart () {
            let that = this;
            this.networkService.getSedParticipantStatisticsCount().then(data => that.sedParticipantStatisticsCount = data);
        }

        loadParticipantGenderCountChart () {
            let that = this;
            this.networkService.getParticipantGenderStatistics().then(data => that.participantGenderCount = data);
        }

        loadParticipantAgeCountChart () {
            let that = this;
            this.networkService.getParticipantAgeStatistics().then(data => that.participantAgeCount = data);
        }

        loadParticipantEducationCountChart () {
            let that = this;
            this.networkService.getParticipantEducationStatistics().then(data => that.participantEducationCount = data);
        }

        loadParticipantProfessionalExperienceCountChart () {
            let that = this;
            this.networkService.getParticipantProfessionalExperienceStatistics().then(data => that.participantProfessionalExperienceCount = data);
        }

        loadParticipantComputerExperienceCountChart () {
            let that = this;
            this.networkService.getParticipantComputerExperienceStatistics().then(data => that.participantComputerExperienceCount = data);
        }

        loadParticipantProductExperienceCountChart () {
            let that = this;
            this.networkService.getParticipantProductExperienceStatistics().then(data => that.participantProductExperienceCount = data);
        }
    },
}

angular.module('chpl.charts')
    .component('chplCharts', ChartsComponent);

export const ChartsComponent = {
    templateUrl: 'chpl.charts/charts.html',
    bindings: {
    },
    controller: class ChartsComponent {
        constructor ($log, networkService) {
            'ngInject'
            this.$log = $log;
            this.networkService = networkService;
        }

        $onInit () {
            this.chartState = {
                isStacked: 'false',
                listingCountType: '1',
                tab: 'product',
            };
            this.loadCriterionProductCountChart();
            this._createIncumbentDevelopersCountChart();
            this._createListingCountCharts();
            this.loadNonconformityCountChart();
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

        ////////////////////////////////////////////////////////////////////

        loadCriterionProductCountChart () {
            let that = this;
            this.networkService.getCriterionProductStatistics().then(data => that.criterionProduct = data);
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

        loadNonconformityCountChart () {
            let that = this;
            this.networkService.getNonconformityStatisticsCount().then(data => that.nonconformityCriteriaCount = data);
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

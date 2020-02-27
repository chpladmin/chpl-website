export const ChartsSurveillanceComponent = {
    templateUrl: 'chpl.charts/surveillance/surveillance.html',
    bindings: {
        nonconformityCriteriaCount: '<',
    },
    controller: class ChartsSurveillanceComponent {
        constructor ($log, utilService) {
            'ngInject'
            this.$log = $log;
            this.utilService = utilService;
            this.nonconformityTypes = [
                'All',
                2014,
                2015,
                'Program',
            ];
            this.chartState = {
                yAxis: '',
                nonconformityCountType: 'All',
            };
        }

        $onChanges (changes) {
            if (changes.nonconformityCriteriaCount) {
                this._createNonconformityCountChart(changes.nonconformityCriteriaCount.currentValue);
            }
        }

        updateYAxis () {
            let that = this;
            Object.values(this.nonconformityCounts).forEach(function (value) {
                value.options.vAxis.scaleType = that.chartState.yAxis;
            });
        }

        _createNonconformityCountChart (data) {
            this.nonconformityCounts = {
                'All': {
                    type: 'ColumnChart',
                    data: {
                        cols: [
                            { label: 'All Certification Criteria and Program Requirements Surveilled', type: 'string'},
                            { label: 'Number of Non-Conformities', type: 'number'},
                        ],
                        rows: this._getNonconformityCountDataInChartFormat(data, 'All'),
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
                            scaleType: this.chartState.yAxis,
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
                        rows: this._getNonconformityCountDataInChartFormat(data, 2014),
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
                            scaleType: this.chartState.yAxis,
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
                        rows: this._getNonconformityCountDataInChartFormat(data, 2015),
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
                            scaleType: this.chartState.yAxis,
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
                        rows: this._getNonconformityCountDataInChartFormat(data, 'Program'),
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
                            scaleType: this.chartState.yAxis,
                            title: 'Number of Non-Conformities',
                            minValue: 0,
                        },
                    },
                },
            }
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
    },
}

angular.module('chpl.charts')
    .component('chplChartsSurveillance', ChartsSurveillanceComponent);

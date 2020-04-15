export const ChartsProductComponent = {
    templateUrl: 'chpl.charts/product/product.html',
    bindings: {
        criterionProduct: '<',
    },
    controller: class ChartsProductComponent {
        constructor ($log, utilService) {
            'ngInject'
            this.$log = $log;
            this.utilService = utilService;
            this.chartState = {
                productEdition: 2014,
            };
        }

        $onChanges (changes) {
            if (changes.criterionProduct) {
                this._createCriterionProductCountChart(changes.criterionProduct.currentValue);
            }
        }

        _createCriterionProductCountChart (data) {
            this.criterionProductCounts = {
                2014: {
                    type: 'BarChart',
                    data: {
                        cols: [
                            { label: 'Certification Criteria', type: 'string'},
                            { label: 'Number of Unique Products', type: 'number'},
                            { type: 'string', role: 'tooltip'},
                        ],
                        rows: this._getCriterionProductCountDataInChartFormat(data, 2014),
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
                        rows: this._getCriterionProductCountDataInChartFormat(data, 2015),
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
        }

        _getCriterionProductCountDataInChartFormat (data, edition) {
            let that = this;
            return data.criterionProductStatisticsResult.filter(obj => obj.criterion.number.indexOf('170.3' + (edition + '').substring(2)) >= 0)
                .map(obj => {
                    //Elevate the criteria information in the object, to allow for sorting
                    obj.number = obj.criterion.number;
                    obj.title = obj.criterion.title;
                    return obj;
                })
                .sort((a, b) => that.utilService.sortCertActual(a, b))
                .map(obj => {
                    return {c: [{
                        v: obj.criterion.number + (obj.criterion.title.indexOf('Cures Update') > 0 ? ' (Cures Update)' : ''),
                    },{v: obj.productCount}, {v: 'Name: ' + obj.criterion.title + '\n Count: ' + obj.productCount}]};
                });
        }
    },
}

angular.module('chpl.charts')
    .component('chplChartsProduct', ChartsProductComponent);

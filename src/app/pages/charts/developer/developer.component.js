export const ChartsDeveloperComponent = {
  templateUrl: 'chpl.charts/developer/developer.html',
  bindings: {
    incumbentDevelopers: '<',
    listingCountData: '<',
  },
  controller: class ChartsDeveloperComponent {
    constructor ($analytics, $log) {
      'ngInject';
      this.$analytics = $analytics;
      this.$log = $log;
      this.chartState = {
        isStacked: 'false',
      };
    }

    $onChanges (changes) {
      if (changes.incumbentDevelopers) {
        this._createIncumbentDevelopersCountChart(changes.incumbentDevelopers.currentValue);
      }
      if (changes.listingCountData) {
        this._createListingCountCharts(changes.listingCountData.currentValue);
      }
    }

    updateChartStack () {
      let that = this;
      Object.keys(this.listingCount.edition).forEach(function (key) {
        that.listingCount.edition[key].chart.options.isStacked = that.chartState.isStacked;
      });
      Object.keys(this.listingCount.class).forEach(function (key) {
        that.listingCount.class[key].chart.options.isStacked = that.chartState.isStacked;
      });
      let type;
      switch (this.chartState.isStacked) {
      case 'absolute': type = 'Absolute'; break;
      case 'percent': type = 'Percent'; break;
      default: type = 'None';
      }
      this.$analytics.eventTrack('Change Developer Charts Stacking Type', { category: 'Charts', label: type });
    }

    updateStatus () {
      this.$analytics.eventTrack('Filter Developer Charts by Certification Status', { category: 'Charts', label: this.chartState.listingCountType.name });
    }

    _createIncumbentDevelopersCountChart (data) {
      this.incumbentDevelopersCounts =
                data.incumbentDevelopersStatisticsResult.sort(function (a, b) {
                  if (a.oldCertificationEdition.id === b.oldCertificationEdition.id) {
                    return a.newCertificationEdition.id - b.newCertificationEdition.id;
                  } else {
                    return a.oldCertificationEdition.id - b.oldCertificationEdition.id;
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
                      title: 'New vs. Incumbent Developers by Edition, ' + obj.oldCertificationEdition.name + ' to ' + obj.newCertificationEdition.name,
                    },
                  };
                  return chart;
                });
    }

    _createListingCountCharts (data) {
      let that = this;
      this.listingCount = {
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
      this.listingCountTypes = Object.keys(this.listingCount.edition)
        .map(function (key) {
          return {
            id: key,
            name: that.listingCount.edition[key].name,
          };
        });
      this.chartState.listingCountType = this.listingCountTypes.find(t => t.name === 'Active');
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
      };
    }

    _createListingCountChartClass (data, status) {
      return {
        type: 'ColumnChart',
        data: {
          cols: [
            { label: 'Number of Developers and Products with "' + status + '" Listings', type: 'string'},
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
      };
    }

    _getListingCountChartEditionData (data, status) {
      return data.statisticsResult.filter(function (a) {
        return a.certificationStatus.name === status;
      }).map(function (obj) {
        return {c: [
          { v: obj.certificationEdition.name },
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
        transformedData.developer[obj.certificationEdition.name] = obj.developerCount;
        transformedData.product[obj.certificationEdition.name] = obj.productCount;
      });
      return [{
        c: [{ v: 'Developer' }]
          .concat(
            Object.keys(transformedData.developer)
              .sort()
              .map(function (key) {
                return { v: transformedData.developer[key]};
              })
          ),
      },{
        c: [{ v: 'Product' }]
          .concat(
            Object.keys(transformedData.product)
              .sort()
              .map(function (key) {
                return { v: transformedData.product[key]};
              })
          ),
      }];
    }
  },
};

angular.module('chpl.charts')
  .component('chplChartsDeveloper', ChartsDeveloperComponent);

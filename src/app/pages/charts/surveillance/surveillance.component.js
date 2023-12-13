import { sortNonconformityTypes } from 'services/surveillance.service';

const getNonconformityCountDataInChartFormat = (data, type) => data.nonconformityStatisticsResult
  .map((obj) => ({
    ...obj,
    nonconformityType: obj.criterion ? ((obj.criterion.removed ? 'Removed | ' : '') + obj.criterion.number) : obj.nonconformityType,
    number: obj.criterion ? obj.criterion.number : '',
    title: obj.criterion ? obj.criterion.title : obj.nonconformityType,
  }))
  .filter((obj) => {
    switch (type) {
      case 'Certification Criteria':
        return obj.nonconformityType.includes('170.315');
      case 'Program':
        return !obj.nonconformityType.includes('170.314') && !obj.nonconformityType.includes('170.315');
      case 'All':
        return !obj.nonconformityType.includes('170.314');
      default:
        return false;
    }
  })
  .sort(sortNonconformityTypes)
  .map((obj) => ({ c: [{ v: obj.nonconformityType }, { v: obj.nonconformityCount }] }));

const ChartsSurveillanceComponent = {
  templateUrl: 'chpl.charts/surveillance/surveillance.html',
  bindings: {
    nonconformityCriteriaCount: '<',
  },
  controller: class ChartsSurveillanceComponent {
    constructor($analytics, $log, utilService) {
      'ngInject';

      this.$analytics = $analytics;
      this.$log = $log;
      this.utilService = utilService;
      this.nonconformityTypes = [
        'All',
        'Certification Criteria',
        'Program',
      ];
      this.chartState = {
        yAxis: '',
        nonconformityCountType: 'All',
      };
    }

    $onChanges(changes) {
      if (changes.nonconformityCriteriaCount) {
        this.createNonconformityCountChart(changes.nonconformityCriteriaCount.currentValue);
      }
    }

    updateType() {
      this.$analytics.eventTrack('Filter Non-conformity Charts by Type of Program Requirements Surveilled', { category: 'Charts', label: this.chartState.nonconformityCountType });
    }

    updateYAxis() {
      const that = this;
      Object.values(this.nonconformityCounts).forEach((value) => {
        value.options.hAxis.scaleType = that.chartState.yAxis;
      });
      const type = this.chartState.yAxis === 'mirrorLog' ? 'Log' : 'Linear';
      this.$analytics.eventTrack('Change Non-conformity Charts Y Axis', { category: 'Charts', label: type });
    }

    createNonconformityCountChart(data) {
      this.nonconformityCounts = {
        All: {
          type: 'BarChart',
          data: {
            cols: [
              { label: 'All Certification Criteria and Program Requirements Surveilled', type: 'string' },
              { label: 'Number of Non-Conformities', type: 'number' },
            ],
            rows: getNonconformityCountDataInChartFormat(data, 'All'),
          },
          options: {
            height: '2200',
            chartArea: {width: '60%', height: '2000'},
            bar: { groupWidth: 20 },  
            animation: {
              duration: 1000,
              easing: 'inAndOut',
              startup: true,
            },
            title: 'Number of Non-Conformities by Certification Criteria and Program Requirements Surveilled',
            vAxis: {
              title: 'All Certification Criteria and Program Requirements Surveilled',
              minValue: 0,
              textStyle : {
                fontSize: 11,
              }
            },  
            hAxis: {
              scaleType: this.chartState.yAxis,
              title: 'Number of Non-Conformities',
              minValue: 0,
            },
          },
        },
        'Certification Criteria': {
          type: 'BarChart',
          data: {
            cols: [
              { label: 'All Certification Criteria and Program Requirements Surveilled', type: 'string' },
              { label: 'Number of Non-Conformities', type: 'number' },
            ],
            rows: getNonconformityCountDataInChartFormat(data, 'Certification Criteria'),
          },
          options: {
            height: '2200',
            chartArea: {width: '60%', height: '2000'},
            bar: { groupWidth: 20 },  
            animation: {
              duration: 1000,
              easing: 'inAndOut',
              startup: true,
            },
            title: 'Number of Non-Conformities by Certification Criteria and Program Requirements Surveilled',
            vAxis: {
              title: 'All Certification Criteria and Program Requirements Surveilled',
              minValue: 0,
              textStyle : {
                fontSize: 11,
              }
            },  
            hAxis: {
              scaleType: this.chartState.yAxis,
              title: 'Number of Non-Conformities',
              minValue: 0,
            },
          },
        },
        Program: {
          type: 'BarChart',
          data: {
            cols: [
              { label: 'All Certification Criteria and Program Requirements Surveilled', type: 'string' },
              { label: 'Number of Non-Conformities', type: 'number' },
            ],
            rows: getNonconformityCountDataInChartFormat(data, 'Program'),
          },
          options: {
            height: '700',
            chartArea: {width: '60%', height: '500'},
            bar: { groupWidth: 20 },  
            animation: {
              duration: 1000,
              easing: 'inAndOut',
              startup: true,
            },
            title: 'Number of Non-Conformities by Certification Criteria and Program Requirements Surveilled',
            vAxis: {
              title: 'All Certification Criteria and Program Requirements Surveilled',
              minValue: 0,
              textStyle : {
                fontSize: 11,
              }
            },  
            hAxis: {
              scaleType: this.chartState.yAxis,
              title: 'Number of Non-Conformities',
              minValue: 0,
            },
          },
        },
      };
    }
  },
};

angular.module('chpl.charts')
  .component('chplChartsSurveillance', ChartsSurveillanceComponent);

export default ChartsSurveillanceComponent;

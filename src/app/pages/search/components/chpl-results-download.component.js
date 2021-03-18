export const ResultsDownloadComponent = {
  templateUrl: 'chpl.search/components/chpl-results-download.html',
  bindings: {
    listings: '<',
    categories: '<',
  },
  controller: class ResultsDownloadController {
    constructor ($analytics, $log, utilService) {
      'ngInject';
      this.$analytics = $analytics;
      this.$log = $log;
      this.utilService = utilService;
      this.csvData = {
        name: 'search-results.csv',
      };
    }

    $onChanges (changes) {
      if (changes.listings) {
        this.listings = angular.copy(changes.listings.currentValue);
      }
      if (changes.categories) {
        this.categories = changes.categories.currentValue.map(cat => {
          cat.default = cat.enabled;
          return cat;
        });
      }
    }

    getCsv () {
      this.makeCsv();
      let added = this.categories.filter(cat => !cat.default && cat.enabled);
      let removed = this.categories.filter(cat => cat.default && !cat.enabled);
      if (added.length === 0 && removed.length === 0) {
        this.$analytics.eventTrack('Download Results With Default Data', { category: 'Search' });
      } else {
        let that = this;
        added.forEach(cat => {
          that.$analytics.eventTrack('Download Results With Additional Data', { category: 'Search', label: cat.display });
        });
        removed.forEach(cat => {
          that.$analytics.eventTrack('Download Results With Less Data', { category: 'Search', label: cat.display });
        });
      }
      this.utilService.makeCsv(this.csvData);
    }

    makeCsv () {
      this.csvData.values = [];
      let row = [];
      this.categories.filter(cat => cat.enabled)
        .forEach(cat => row = row.concat(cat.columns.map(col => col.display)));
      this.csvData.values.push(row);
      this.listings.forEach(l => {
        row = [];
        this.categories.filter(cat => cat.enabled)
          .forEach(cat => row = row.concat(cat.columns.map(col => {
            if (col.transform) {
              return col.transform(l[col.key]);
            } else {
              return l[col.key];
            }
          })));
        this.csvData.values.push(row);
      });
    }
  },
};

angular
  .module('chpl.search')
  .component('chplResultsDownload', ResultsDownloadComponent);

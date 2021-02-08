export const ResultsDownloadComponent = {
  templateUrl: 'chpl.search/components/chpl-results-download.html',
  bindings: {
    listings: '<',
    categories: '<',
  },
  controller: class ResultsDownloadController {
    constructor ($log, utilService) {
      'ngInject';
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
        this.categories = angular.copy(changes.categories.currentValue);
      }
    }

    getCsv () {
      this.makeCsv();
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

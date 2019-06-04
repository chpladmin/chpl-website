export const SurveillanceManagementComponent = {
    templateUrl: 'chpl.surveillance/surveillance/manage.html',
    bindings: { },
    controller: class SurveillanceManagementComponent {
        constructor ($log, networkService) {
            'ngInject'
            this.$log = $log;
            this.networkService = networkService;
        }

        search () {
            let query = {
                pageNumber: 0,
                pageSize: '50',
                searchTerm: this.surveillanceSearch.query,
            };
            let that = this;
            this.surveillanceProduct = null;
            this.surveillanceSearch.results = null;
            this.networkService.search(query)
                .then(response => {
                    that.surveillanceSearch.results = response.results;
                    if (that.surveillanceSearch.results.length === 1) {
                        that.productId = that.surveillanceSearch.results[0].id;
                        that.loadSurveillance();
                    }
                });
        }

        loadSurveillance () {
            let that = this;
            this.networkService.getListing(this.productId, this.forceRefresh)
                .then(result => that.surveillanceProduct = result);
        }
    },
}

angular.module('chpl.surveillance')
    .component('chplSurveillanceManagement', SurveillanceManagementComponent);

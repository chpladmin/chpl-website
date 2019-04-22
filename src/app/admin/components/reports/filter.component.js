export const FilterComponent = {
    templateUrl: 'chpl.admin/components/reports/filter.component.html',
    bindings: {
        filterTypeId: '<?',
        onApplyFilter: '&',
        getFilterData: '&',
    },
    controller: class FilterComponent {
        constructor ($filter, $log, networkService, utilService) {
            'ngInject'
            this.$filter = $filter;
            this.$log = $log;
            this.networkService = networkService;
            this.utilService = utilService;
        }

        $onInit () {
            this.filterName = '';
            this.refreshFilterList();
        }

        refreshFilterList () {
            let that = this;
            this.networkService.getFilters(this.filterTypeId)
                .then(response => {
                    that.availableFilters = response.results;
                    that.availableFilters.sort((a, b) => (a.name > b.name) ? 1 : -1)
                });
        }

        applyFilter (filter) {
            this.onApplyFilter(filter);
        }

        saveFilter () {
            let that = this;
            let filter = {};
            filter.filterType = {};
            filter.filterType.id = this.filterTypeId;
            filter.filter = JSON.stringify(this.getFilterData());
            filter.name = this.filterName;
            this.$log.info(filter);

            this.networkService.createFilter(filter)
                .then(() => {
                    that.refreshFilterList();
                    that.filterName = '';
                });
        }

        deleteFilter (filterId) {
            let that = this;
            this.networkService.deleteFilter(filterId)
                .then(() => that.refreshFilterList());
        }
    },
}

angular.module('chpl.admin')
    .component('aiFilter', FilterComponent);


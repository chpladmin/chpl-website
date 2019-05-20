export const FilterComponent = {
    templateUrl: 'chpl.admin/components/reports/filter.component.html',
    bindings: {
        filterTypeName: '@',
        onApplyFilter: '&',
        getFilterData: '&',
    },
    controller: class FilterComponent {
        constructor ($filter, $log, $scope, networkService, utilService) {
            'ngInject'
            this.$filter = $filter;
            this.$log = $log;
            this.$scope = $scope;
            this.networkService = networkService;
            this.utilService = utilService;
        }

        $onInit () {
            let that = this;
            this.filterName = '';
            this.networkService.getFilterTypes()
                .then(response => {
                    that.filterTypeId = response.data.find(item => item.name === that.filterTypeName).id;
                    that.refreshFilterList();
                });

            //Handle unimpersonate
            var unimpersonating = this.$scope.$on('unimpersonating', function () {
                that.refreshFilterList();
            });
            this.$scope.$on('$destroy', unimpersonating);
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
    .component('chplFilter', FilterComponent);


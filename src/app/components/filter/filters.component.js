export const FiltersComponent = {
    templateUrl: 'chpl.components/filter/filters.html',
    bindings: {
    },
    transclude: {
        header: 'chplFiltersHeader',
        body: 'chplFiltersBody',
        saved: 'chplFiltersSaved',
    },
    controller: class FiltersComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
            this.filters = [];
        }

        select (filter) {
            this.filters.forEach(filter => {
                filter.selected = false;
            });
            filter.selected = true;
        }

        addFilter (filter) {
            if (this.filters.length === 0) {
                this.select(filter);
            }
            this.filters.push(filter);
        }

        /*
        onApplyFilter (filter) {
            let f = angular.fromJson(filter);
            this.doFilter(f);
        }

        onClearFilter () {
            let filterData = {};
            filterData.dataFilter = '';
            filterData.tableState = this.tableController.tableState();
            this.clearFilterHs.forEach(handler => handler());
            this.doFilter(filterData);
        }

        doFilter (filter) {
            let that = this;
            this.filterText = filter.dataFilter;
            let filterItems = [
                'acbName',
                'complaintStatusTypeName',
                'receivedDate',
                'closedDate',
                'complainantTypeName',
                'complainantContacted',
                'developerContacted',
                'oncAtlContacted',
            ];
            filterItems.forEach(predicate => {
                if (filter.tableState.search.predicateObject[predicate]) {
                    this.tableController.search(filter.tableState.search.predicateObject[predicate], predicate);
                } else {
                    this.tableController.search({}, predicate);
                }
            });
            this.restoreStateHs.forEach(handler => handler(that.tableController.tableState()));
            this.tableController.sortBy(filter.tableState.sort.predicate, filter.tableState.sort.reverse);
        }

        registerClearFilter (handler) {
            this.clearFilterHs.push(handler);
        }

        registerRestoreState (handler) {
            this.restoreStateHs.push(handler);
        }

        getFilterData () {
            let filterData = {};
            filterData.dataFilter = this.filterText;
            filterData.tableState = this.tableController.tableState();
            return filterData;
        }

        tableStateListener (tableController) {
            this.tableController = tableController;
        }
        */
    },
}

angular.module('chpl.components')
    .component('chplFilters', FiltersComponent);

export const FilterEditionComponent = {
    templateUrl: 'chpl.components/smart-table/chpl-filter-edition.html',
    bindings: {
        nameSpace: '@?',
        onChange: '&',
        registerClearFilter: '&?',
        registerRestoreState: '&?',
        registerShowRetired: '&?',
    },
    require: ['^stTable'],
    controller: class FilterEditionComponent {
        constructor ($localStorage, $log) {
            'ngInject'
            this.$localStorage = $localStorage;
            this.$log = $log;
        }

        $onInit () {
            this.items = [
                { value: '2011', display: '2011', retired: true, selected: false },
                { value: '2014', display: '2014', retired: true, selected: false },
                { value: '2015', display: '2015', retired: false, selected: true },
                { value: '2015 Cures Edition', display: '2015 Cures Edition', retired: false, selected: true },
            ];

            let that = this;
            if (this.registerClearFilter) {
                this.clearFilter = this.registerClearFilter({
                    clearFilter: () => {
                        that.clearFilter();
                    },
                });
            }
            if (this.registerRestoreState) {
                this.restoreState = this.registerRestoreState({
                    restoreState: state => {
                        that.restoreState(state);
                    },
                });
            }
            if (this.registerShowRetired) {
                this.showRetired = this.registerShowRetired({
                    showRetired: state => {
                        that.showRetired(state);
                    },
                });
            }
        }

        clearFilter () {
            this.items.forEach(edition => edition.selected = edition.retired);
            this.filterChanged();
        }

        filterChanged () {
            let query = {
                certificationEdition: {
                    items: this.items,
                },
            }
            this.stTable.search(query);
            this.onChange({
                hasChanges: this.isChanged(),
            });
            this.storeState();
        }

        isChanged () {
            return this.items.reduce((acc, edition) => acc || this.isNotDefault(edition.selected), false);
        }

        isNotDefault (item) {
            return item.selected !== item.retired;
        }

        restoreState (state) {
            this.items = angular.copy(state.items);
            this.filterChanged();
        }

        selectAll () {
            this.items.forEach(edition => edition.selected = true);
            this.filterChanged();
        }

        showRetired () {
            this.items
                .filter(edition => edition.retired)
                .forEach(edition => edition.selected = true);
            this.filterChanged();
        }

        storeState () {
            if (this.nameSpace) {
                this.$localStorage[this.nameSpace] = angular.toJson(this.stTable.tableState());
            }
        }

        toggleSelection (item) {
            if (item.retired) {
                this.onChange({
                    showRetired: true,
                });
            }
            this.filterChanged();
        }
    },
}

angular.module('chpl.components')
    .component('chplFilterEdition', FilterEditionComponent);

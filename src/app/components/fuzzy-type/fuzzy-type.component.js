export const FuzzyTypeComponent = {
    templateUrl: 'chpl.components/fuzzy-type/fuzzy-type.html',
    bindings: {
        fuzzyType: '<',
        takeAction: '&',
    },
    controller: class FuzzyTypeComponent {
        constructor ($filter, $log) {
            'ngInject'
            this.$filter = $filter;
            this.$log = $log;
            this.backup = {};
        }

        $onChanges (changes) {
            if (changes.fuzzyType) {
                this.fuzzyType = angular.copy(changes.fuzzyType.currentValue);
            }
            if (this.fuzzyType) {
                this.fuzzyType.choices = this.fuzzyType.choices.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
                this.backup.fuzzyType = angular.copy(this.fuzzyType);
            }
        }

        edit () {
            this.isEditing = true;
            this.takeAction({
                data: this.fuzzyType,
                action: 'edit',
            });
        }

        save () {
            this.isEditing = false;
            this.takeAction({
                data: this.fuzzyType,
                action: 'save',
            });
        }

        cancel () {
            this.isEditing = false;
            this.fuzzyType = angular.copy(this.backup.fuzzyType);
            this.takeAction({
                data: this.fuzzyType,
                action: 'cancel',
            });
        }
    },
}

angular.module('chpl.components')
    .component('chplFuzzyType', FuzzyTypeComponent);

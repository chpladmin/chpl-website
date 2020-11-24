export const ActionBarComponent = {
    templateUrl: 'chpl.components/action-bar/action-bar.html',
    bindings: {
        canAct: '&',
        errorMessages: '<',
        isDisabled: '<',
        isWizard: '@',
        takeAction: '&',
        warningMessages: '<',
    },
    controller: class ActionBarComponent {
        constructor ($log) {
            'ngInject';
            this.$log = $log;
            this.previousErrors = [];
            this.previousWarnings = [];
        }

        $onChanges (changes) {
            if (changes.errorMessages && changes.errorMessages.currentValue) {
                this.errorMessages = changes.errorMessages.currentValue
                    .map(m => m)
                    .sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
                let needToShow = this.errorMessages.reduce((acc, m) => acc || !this.previousErrors.includes(m), this.previousErrors.length !== this.errorMessages.length);
                if (needToShow) {
                    this.showErrors = true;
                }
                this.previousErrors = angular.copy(this.errorMessages);
            }
            if (changes.warningMessages && changes.warningMessages.currentValue) {
                this.warningMessages = changes.warningMessages.currentValue
                    .map(m => m)
                    .sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
                let needToShow = this.warningMessages.reduce((acc, m) => acc || !this.previousWarnings.includes(m), this.previousWarnings.length !== this.warningMessages.length);
                if (needToShow) {
                    this.showErrors = true;
                }
                this.previousWarnings = angular.copy(this.warningMessages);
            }
        }

        act (action) {
            this.takeAction({
                action: action,
            });
        }

        can (action) {
            return this.canAct({
                action: action,
            });
        }

        updateAcknowledgement () {
            this.takeAction({
                action: 'updateAcknowledgement',
                data: this.acknowledgeWarnings,
            });
        }
    },
};

angular.module('chpl.components')
    .component('chplActionBar', ActionBarComponent);

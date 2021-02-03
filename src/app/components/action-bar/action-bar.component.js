export const ActionBarComponent = {
    templateUrl: 'chpl.components/action-bar/action-bar.html',
    bindings: {
        canAct: '&',
        errorMessages: '<',
        isDisabled: '<',
        isWizard: '@',
        takeAction: '&',
        warningMessages: '<',
        options: '<',
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
            }
            if (changes.warningMessages && changes.warningMessages.currentValue) {
                this.warningMessages = changes.warningMessages.currentValue
                    .map(m => m)
                    .sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
                let needToShow = this.warningMessages.reduce((acc, m) => acc || !this.previousWarnings.includes(m), this.previousWarnings.length !== this.warningMessages.length);
                if (needToShow) {
                    this.showErrors = true;
                }
            }
            if (changes.options && changes.options.currentValue) {
                this.maxMessageCharacters = changes.options.currentValue.maxMessageCharacters;
                this.canDelete = changes.options.currentValue.canDelete;
            }
        }

        act (action) {
            this.takeAction({
                action: action,
            });
        }

        can (action) {
            this.$log.info('here 1 ' + action);
            this.$log.info(this.canAct);
            this.$log.info(this.takeAction);
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

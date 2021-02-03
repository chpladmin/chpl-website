export const ConfirmVersionComponent = {
    templateUrl: 'chpl.components/listing/confirm/version.html',
    bindings: {
        product: '<',
        showFormErrors: '<',
        takeAction: '&',
        uploaded: '<',
    },
    controller: class ConfirmVersionController {
        constructor ($log, networkService) {
            'ngInject';
            this.$log = $log;
            this.networkService = networkService;
            this.backup = {};
        }

        $onInit () {
            if (this.versions) {
                if (!this.versions.find(d => d.versionId === undefined)) {
                    this.versions.splice(0, 0, {
                        version: '--- Create a new Version ---',
                        versionId: undefined,
                    });
                }
                if (this.pending) {
                    this.pendingSelect = this.versions.find(d => d.versionId === this.pending.versionId);
                } else if (this.uploaded) {
                    this.pendingSelect = this.versions.find(d => d.versionId === undefined);
                    this.pending = angular.copy(this.uploaded);
                }
            }
        }

        $onChanges (changes) {
            if (changes.product && changes.product.currentValue) {
                this.product = angular.copy(changes.product.currentValue);
            }
            if (changes.uploaded) {
                this.uploaded = angular.copy(changes.uploaded.currentValue);
            }
            if (this.product && this.product.productId) {
                this.networkService.getVersionsByProduct(this.product.productId)
                    .then(result => this.versions = result);
            }
            if (this.uploaded && this.uploaded.versionId) {
                this.networkService.getVersion(this.uploaded.versionId)
                    .then(result => this.pending = result);
            }
        }

        selectConfirmingVersion () {
            this.uploaded.versionId = this.pendingSelect.versionId;
            this.takeAction({action: 'select', payload: this.pendingSelect.versionId});
            this.form.$setPristine();
        }

        saveConfirmingVersion () {
            let version = {
                versionCode: this.pending.versionCode,
                version: this.pending.version,
            };
            let that = this;
            this.networkService.updateVersion(version)
                .then(() => {
                    that.takeAction({action: 'select', payload: version.versionId});
                    that.form.$setPristine();
                });
        }

        undoEdits () {
            this.pending = angular.copy(this.backup.pending);
            this.form.$setPristine();
            this.analyzeDifferences();
            this.takeAction({action: 'clear'});
        }
    },
};

angular.module('chpl.components')
    .component('chplConfirmVersion', ConfirmVersionComponent);

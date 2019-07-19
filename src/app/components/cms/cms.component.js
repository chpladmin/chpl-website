export const CmsManagementComponent = {
    templateUrl: 'chpl.components/cms/cms.html',
    bindings: {},
    controller: class CmsManagementController {
        constructor ($log, authService, networkService) {
            'ngInject'
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
        }

        $onInit () {
            this.filename = 'CMS_IDs_' + new Date().getTime() + '.csv';
            this.csvHeader = ['CMS ID', 'Creation Date'];
            this.csvColumnOrder = ['certificationId', 'created'];
            if (this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) {
                this.csvHeader.push('CHPL Product(s)');
                this.csvColumnOrder.push('products');
            }
            this.isReady = false;
            this.isProcessing = false;
        }

        getDownload () {
            this.isProcessing = true;
            this.networkService.getCmsDownload()
                .then(result => {
                    this.cmsArray = result.map(res => {
                        res.created = new Date(res.created).toISOString().substring(0, 10);
                        return res;
                    });
                    this.cmsArray = result
                    this.isProcessing = false;
                    this.isReady = true;
                });
        }
    },
}

angular
    .module('chpl.components')
    .component('chplCmsManagement', CmsManagementComponent);

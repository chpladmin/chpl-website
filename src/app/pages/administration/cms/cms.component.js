export const CmsComponent = {
    templateUrl: 'chpl.administration/cms/cms.html',
    bindings: {
    },
    controller: class CmsComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
        }
    },
}

angular.module('chpl.administration')
    .component('chplCms', CmsComponent);

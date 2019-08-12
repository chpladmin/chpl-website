export const CmsComponent = {
    templateUrl: 'chpl.administration/cms/cms.html',
    bindings: {
    },
    controller: class CmsComponent {
        constructor ($log, authService) {
            'ngInject'
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
        }
    },
}

angular.module('chpl.administration')
    .component('chplCms', CmsComponent);

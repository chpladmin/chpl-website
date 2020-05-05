export const OverviewComponent = {
    templateUrl: 'chpl.resources/overview/overview.html',
    bindings: {
    },
    controller: class OverviewController {
        constructor ($anchorScroll, $location, $log, $rootScope, featureFlags, networkService) {
            'ngInject'
            this.$anchorScroll = $anchorScroll;
            this.$location = $location;
            this.$log = $log;
            this.currentPage = $rootScope.currentPage;
            this.isOn = featureFlags.isOn;
            this.networkService = networkService;
        }

        $onInit () {
            this.loadAnnouncements();
            this.loadAcbs();
            this.loadAtls();
        }

        loadAnnouncements () {
            let ctrl = this;
            this.networkService.getAnnouncements(false)
                .then(function (result) {
                    ctrl.announcements = result.announcements.sort((a, b) => (a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0));
                }, function (error) {
                    ctrl.$log.error('error in app.overview.component.loadAnnouncements', error);
                });
        }

        loadAcbs () {
            let ctrl = this;
            this.networkService.getAcbs(false)
                .then(function (result) {
                    ctrl.acbs = result.acbs.filter(acb => !acb.retired).sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
                }, function (error) {
                    ctrl.$log.error('error in app.overview.component.loadAcbs', error);
                });
        }

        loadAtls () {
            let ctrl = this;
            this.networkService.getAtls(false)
                .then(function (result) {
                    ctrl.atls = result.atls.filter(atl => !atl.retired).sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
                }, function (error) {
                    ctrl.$log.error('error in app.overview.component.loadAtls', error);
                });
        }

        toTop () {
            this.$location.hash('');
            this.$anchorScroll();
        }
    },
}

angular
    .module('chpl.resources')
    .component('aiOverview', OverviewComponent);

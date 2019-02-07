export const OverviewComponent = {
    templateUrl: 'chpl.overview/overview.html',
    bindings: {
    },
    controller: class OverviewController {
        constructor ($anchorScroll, $location, $log, networkService) {
            'ngInject'
            this.$anchorScroll = $anchorScroll;
            this.$location = $location;
            this.$log = $log;
            this.networkService = networkService;
        }

        $onInit () {
            this.loadAnnouncements();
            this.loadAcbs();
            this.loadAtls();
        }

        loadAnnouncements () {
            this.networkService.getAnnouncements(false)
                .then(function (result) {
                    this.announcements = result.announcements;
                }, function (error) {
                    this.$log.error('error in app.overview.controller.loadAnnouncements', error);
                });
        }

        loadAcbs () {
            this.networkService.getAcbs(false)
                .then(function (result) {
                    this.acbs = result.acbs.filter(acb => !acb.retired);
                }, function (error) {
                    this.$log.error('error in app.overview.controller.loadAcbs', error);
                });
        }

        loadAtls () {
            this.networkService.getAtls(false)
                .then(function (result) {
                    this.atls = result.atls.filter(atl => !atl.retired);
                }, function (error) {
                    this.$log.error('error in app.overview.controller.loadAtls', error);
                });
        }

        toTop () {
            this.$location.hash('');
            this.$anchorScroll();
        }
    },
}

angular
    .module('chpl.overview')
    .component('aiOverview', OverviewComponent);

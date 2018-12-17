(function () {
    'use strict';

    angular
        .module('chpl.overview')
        .controller('OverviewController', OverviewController);

    /** @ngInject */
    function OverviewController ($anchorScroll, $location, $log, networkService) {
        var vm = this;

        vm.loadAcbs = loadAcbs;
        vm.loadAtls = loadAtls;
        vm.loadAnnouncements = loadAnnouncements;
        vm.toTop = toTop;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.loadAcbs();
            vm.loadAtls();
            vm.loadAnnouncements();
        }

        function loadAnnouncements () {
            networkService.getAnnouncements(false)
                .then(function (result) {
                    vm.announcements = result.announcements;
                }, function (error) {
                    $log.error('error in app.overview.controller.loadAnnouncements', error);
                });
        }

        function loadAcbs () {
            networkService.getAcbs(false)
                .then(function (result) {
                    vm.acbs = result.acbs.filter(acb => !acb.retired);
                }, function (error) {
                    $log.error('error in app.overview.controller.loadAcbs', error);
                });
        }

        function loadAtls () {
            networkService.getAtls(false)
                .then(function (result) {
                    vm.atls = result.atls.filter(atl => !atl.retired);
                }, function (error) {
                    $log.error('error in app.overview.controller.loadAtls', error);
                });
        }

        function toTop () {
            $location.hash('');
            $anchorScroll();
        }
    }
})();

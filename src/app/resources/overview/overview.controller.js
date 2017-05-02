(function () {
    'use strict';

    angular
        .module('chpl.overview')
        .controller('OverviewController', OverviewController);

    /** @ngInject */
    function OverviewController($log, $anchorScroll, $location, commonService) {
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
            commonService.getAnnouncements(false)
                .then (function (result) {
                    vm.announcements = result.announcements;
                }, function (error) {
                    $log.error('error in app.overview.controller.loadAnnouncements', error);
                });
        }

        function loadAcbs () {
            commonService.getAcbs(false)
                .then (function (result) {
                    vm.acbs = result.acbs;
                }, function (error) {
                    $log.error('error in app.overview.controller.loadAcbs', error);
                });
        }

        function loadAtls () {
            commonService.getAtls(false)
                .then(function (result) {
                    vm.atls = result.atls;
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

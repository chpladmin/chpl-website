;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('AnnouncementsController', ['$log', 'commonService', 'authService', '$modal', function ($log, commonService, authService, $modal) {
            var vm = this;

            vm.loadAnnouncements = loadAnnouncements;
            vm.create = create;
            vm.edit = edit;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.loadAnnouncements();
                vm.isChplAdmin = authService.isChplAdmin();
            }

            function loadAnnouncements () {
            	commonService.getAnnouncements(true)
            		.then (function (result) {
            			vm.announcements = result.announcements;
            		}, function (error) {
            			$log.debug('error in app.admin.announcement.controller.loadAnnouncements', error);
            		});
            }

            function create () {
                vm.editModalInstance = $modal.open({
                    templateUrl: 'admin/components/announcementEdit.html',
                    controller: 'AnnouncementEditController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                    	announcement: function() {return {}; },
                        action: function () { return 'create'; },
                        authService: function () { return authService; }
                    }
                });
                vm.editModalInstance.result.then(function (result) {
                    if (!vm.announcement) {
                        vm.announcement = [];
                    }
                    vm.announcements.push(result);
                }, function (result) {
                    if (result !== 'cancelled') {
                        console.debug('dismissed', result);
                    }
                });
            }

            function edit (a, index) {
                vm.editModalInstance = $modal.open({
                    templateUrl: 'admin/components/announcementEdit.html',
                    controller: 'AnnouncementEditController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        announcement: function () { return a; },
                        action: function () { return 'edit'; },
                        authService: function () { return authService; }
                    }
                });
                vm.editModalInstance.result.then(function (result) {
                    if (result === 'deleted') {
                        vm.loadAnnouncements();
                    } else
                        vm.announcements[index] = result;
                }, function (result) {
                    if (result !== 'cancelled') {
                        console.debug('dismissed', result);
                    }
                });
            }
        }])
        .directive('aiAnnouncementsManagement', [function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'admin/components/announcements.html',
                scope: {},
                bindToController: {
                    admin: '='
                },
                controllerAs: 'vm',
                controller: 'AnnouncementsController'
            };
        }]);
})();

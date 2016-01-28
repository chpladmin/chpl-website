;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('AnnouncementsController', ['$log', 'commonService', 'authService', '$modal', function ($log, commonService, authService, $modal) {
            var vm = this;
            
            vm.loadAnnouncements = loadAnnouncements;
            vm.create = create;
            vm.edit = edit;
            vm.deleteAnnouncement = deleteAnnouncement;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate() {
                vm.loadAnnouncements();
                vm.isChplAdmin = authService.isChplAdmin();
            }
            
            function loadAnnouncements() {
            	commonService.getAnnouncementsCurrent()
            		.then (function (result) {
            			vm.announcementsCurrent = result.announcements;
            		}, function (error) {
            			$log.debug('error in app.admin.announcement.controller.loadAnnouncements', error);
            		});
            	commonService.getAnnouncementsFuture()
        			.then (function (result) {
        				vm.announcementsFuture = result.announcements;
        			}, function (error) {
        				$log.debug('error in app.admin.announcement.controller.loadAnnouncements', error);
        			});
            }
            
            function create() {
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

            function edit(a, index) {
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
                    vm.announcements[index] = result;
                }, function (result) {
                    if (result !== 'cancelled') {
                        console.debug('dismissed', result);
                    }
                });
            }

            function deleteAnnouncement (announcement,index,isCurrent) {
                commonService.deleteAnnouncement(announcement.id)
                    .then(function (response) {
                        self.activate();
                    });
                if (isCurrent){
                	vm.announcementsCurrent.splice(index, 1);
                }else{
                	vm.announcementsFuture.splice(index, 1);
                }
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


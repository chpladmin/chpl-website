(function () {
    'use strict';

    describe('the CHPL Navigation', function () {
        var $compile, $localStorage, $location, $log, $q, $rootScope, authService, el, mock, networkService, scope, vm;
        mock = {
            announcements: [],
            username: 'a user name',
        };

        beforeEach(function () {
            angular.mock.module('chpl.navigation', 'chpl', /*'chpl.templates',*/ function ($provide) {
                $provide.decorator('authService', function ($delegate) {
                    $delegate.getUsername = jasmine.createSpy('getUsername');
                    $delegate.isAuthed = jasmine.createSpy('isAuthed');
                    return $delegate;
                });
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getAnnouncements = jasmine.createSpy('getAnnouncements');
                    return $delegate;
                });
            });

        });

        beforeEach(inject(function (_$compile_, $controller, _$localStorage_, _$location_, _$log_, _$q_, _$rootScope_, _authService_, _networkService_) {
            $compile = _$compile_;
            $localStorage = _$localStorage_;
            $location = _$location_;
            $log = _$log_;
            $q = _$q_;
            $rootScope = _$rootScope_;
            authService = _authService_;
            authService.getUsername.and.returnValue(mock.username);
            authService.isAuthed.and.returnValue(true);
            networkService = _networkService_;
            networkService.getAnnouncements.and.returnValue($q.when(mock.announcements));

            scope = $rootScope.$new();
            vm = $controller('NavigationController', {
                $scope: scope,
            });
            scope.$digest();
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('directives', function () {
            it('should compile the top', function () {
                el = angular.element('<ai-cms-widget><ai-compare-widget><ai-navigation-top></ai-navigation-top></ai-compare-widget></ai-cms-widget>');
                $compile(el)(scope);
                scope.$digest();

                expect(el.html()).not.toEqual(null);
            });

            it('should compile the bottom', function () {
                el = angular.element('<ai-navigation-bottom></ai-navigation-bottom>');
                $compile(el)(scope);
                scope.$digest();

                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', function () {
            it('should exist', function () {
                expect(vm).toBeDefined();
            });

            it('should return the user name of the logged in user', function () {
                expect(authService.getUsername).not.toHaveBeenCalled();
                expect(vm.getUsername()).toEqual(mock.username);
                expect(authService.getUsername).toHaveBeenCalled();
            });

            it('should call the authService to check if the user is authenticated', function () {
                vm.isAuthed();
                expect(authService.isAuthed).toHaveBeenCalled();
            });

            it('should know what page is active', function () {
                spyOn($location,'path').and.returnValue('/admin/userManagement');
                expect(vm.isActive('/admin')).toBe(true);
                expect(vm.isActive('resources')).toBe(false);
            });

            xdescribe('when dealing with $broadcast', function () {
                it('should show the CMS Widget', function () {
                    spyOn(vm, 'showCmsWidget');
                    $rootScope.$broadcast('ShowWidget');
                    expect(vm.showCmsWidget).toHaveBeenCalled();
                });

                it('should show the Compare Widget', function () {
                    spyOn(vm, 'showCompareWidget');
                    $rootScope.$broadcast('ShowCompareWidget');
                    expect(vm.showCompareWidget).toHaveBeenCalledWith(true);
                });

                it('should hide the Compare Widget', function () {
                    spyOn(vm, 'showCompareWidget');
                    $rootScope.$broadcast('HideCompareWidget');
                    expect(vm.showCompareWidget).toHaveBeenCalledWith(false);
                });

                it('should show announcements', function () {
                    spyOn(vm, 'loadAnnouncements');
                    $rootScope.$broadcast('loggedIn');
                    expect(vm.loadAnnouncements).toHaveBeenCalled();
                });
            });

            it('should clear stuff on clear', function () {
                spyOn($rootScope, '$broadcast');
                $localStorage.clearResults = undefined;
                spyOn($location, 'url');
                vm.clear();
                expect($rootScope.$broadcast).toHaveBeenCalledWith('ClearResults', {});
                expect($localStorage.clearResults).toBe(true);
                expect($location.url).toHaveBeenCalledWith('/search');
            });

            it('should show the CMS Widget', function () {
                expect(vm.widgetExpanded).toBeUndefined();
                vm.showCmsWidget();
                expect(vm.widgetExpanded).toBe(true);
            });

            it('should be able to toggle the Compare Widget', function () {
                expect(vm.compareWidgetExpanded).toBeUndefined();
                vm.showCompareWidget(true);
                expect(vm.compareWidgetExpanded).toBe(true);
                vm.showCompareWidget(false);
                expect(vm.compareWidgetExpanded).toBe(false);
            });
        });
    });
})();

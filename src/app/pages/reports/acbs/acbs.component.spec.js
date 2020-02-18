import {getActivity, getMetadata} from './history.mock';

(() => {
    'use strict';

    describe('the Reports.ACBs component', () => {
        var $compile, $log, $q, ctrl, el, networkService, scope;

        beforeEach(() => {
            angular.mock.module('chpl.reports', $provide => {
                $provide.decorator('networkService', $delegate => {
                    $delegate.getActivityById = jasmine.createSpy('getActivityById');
                    $delegate.getActivityMetadata = jasmine.createSpy('getActivityMetadata');
                    return $delegate;
                });
            });

            inject((_$compile_, $controller, _$log_, _$q_, $rootScope, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.getActivityById.and.callFake(id => $q.when(getActivity(id)));
                networkService.getActivityMetadata.and.returnValue($q.when(getMetadata('acb')));

                scope = $rootScope.$new()

                el = angular.element('<chpl-reports-acbs></chpl-reports-acbs>');

                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
            });
        });

        afterEach(() => {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('view', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', () => {
            it('should exist', () => {
                expect(ctrl).toBeDefined();
            });

            describe('when loading', () => {
                it('should get activity from the network', () => {
                    expect(networkService.getActivityMetadata).toHaveBeenCalledWith('acbs');
                    expect(ctrl.results.length).toBe(2);
                });

                it('should set the friendly date on metadata', () => {
                    expect(ctrl.results[0].friendlyActivityDate).toBe('2019-04-25');
                    expect(ctrl.results[1].friendlyActivityDate).toBe('2019-04-25');
                });

                it('should parse the activity to find an action', () => {
                    expect(ctrl.results[0].action).toBe('ONC-ACB was updated');
                    expect(ctrl.results[1].action).toBe('ONC-ACB was updated');
                });

                it('should parse the activity to find details', () => {
                    expect(ctrl.results[0].details).toEqual([
                        'Website added: http://www.example.com',
                        'Address changes<ul><li>Street Line 1 added: Address</li><li>City added: City</li><li>State added: State</li><li>Zipcode added: zip</li><li>Country added: usa</li></ul>',
                    ]);
                    expect(ctrl.results[1].details).toEqual(['Address changes<ul><li>Street Line 2 changed from Suite 200 to Suite 200b</li></ul>']);
                });

                it('should parse the activity to find csvdetails', () => {
                    expect(ctrl.results[0].csvDetails).toBe('Website added: http://www.example.com\nAddress changes<ul><li>Street Line 1 added: Address</li><li>City added: City</li><li>State added: State</li><li>Zipcode added: zip</li><li>Country added: usa</li></ul>');
                    expect(ctrl.results[1].csvDetails).toBe('Address changes<ul><li>Street Line 2 changed from Suite 200 to Suite 200b</li></ul>');
                });
            });

            describe('when handling download', () => {
                it('should not be ready when no results are defined', () => {
                    ctrl.displayed = undefined;
                    expect(ctrl.downloadReady()).toBeUndefined();
                });

                it('should not be ready when there are no results', () => {
                    ctrl.displayed = [];
                    expect(ctrl.downloadReady()).toBe(false);
                });

                it('should not be ready when the action is not defined', () => {
                    ctrl.displayed = [{ action: undefined }];
                    expect(ctrl.downloadReady()).toBe(false);
                });

                it('should not be ready when any of the actions are not defined', () => {
                    ctrl.displayed = [{action: 'defined'}, { action: undefined }];
                    expect(ctrl.downloadReady()).toBe(false);
                });

                it('should be ready when all of the actions are defined', () => {
                    ctrl.displayed = [{action: 'defined'}, { action: 'defined too' }];
                    expect(ctrl.downloadReady()).toBe(true);
                });
            });
        });
    });
})();

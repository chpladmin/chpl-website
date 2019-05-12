import {getActivity, getMetadata} from './history.mock';

(() => {
    'use strict';

    describe('the Reports.ATLs component', () => {
        var $compile, $log, $q, ctrl, el, networkService, scope;

        beforeEach(() => {
            angular.mock.module('chpl', 'chpl.mock', 'chpl.reports', $provide => {
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
                networkService.getActivityMetadata.and.returnValue($q.when(getMetadata('atl')));

                scope = $rootScope.$new()

                el = angular.element('<chpl-reports-atls></chpl-reports-atls>');

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
            it('should be compiled', () => {
                expect(ctrl).toBeDefined();
            });

            describe('when loading', () => {
                it('should get activity from the network', () => {
                    expect(networkService.getActivityMetadata).toHaveBeenCalledWith('atls');
                    expect(ctrl.results.length).toBe(1);
                });

                it('should set the friendly date on metadata', () => {
                    expect(ctrl.results[0].friendlyActivityDate).toBe('2019-04-26');
                });

                it('should parse the activity to find an action', () => {
                    expect(ctrl.results[0].action).toBe('ONC-ATL was updated');
                });

                it('should parse the activity to find details', () => {
                    expect(ctrl.results[0].details).toEqual([
                        'Address changes<ul><li>Street Line 2 changed from 3rd Floor to 3rd Floor, room 2</li></ul>',
                    ]);
                });

                it('should parse the activity to find csvdetails', () => {
                    expect(ctrl.results[0].csvDetails).toBe('Address changes<ul><li>Street Line 2 changed from 3rd Floor to 3rd Floor, room 2</li></ul>');
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

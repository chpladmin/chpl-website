(() => {
    'use strict';

    describe('the Surveillance Complaint component', () => {
        var $compile, $log, authService, ctrl, el, mock, scope;

        mock = {
            complaint: {},
        };

        beforeEach(() => {
            angular.mock.module('chpl.services', 'chpl.components', $provide => {
                $provide.decorator('authService', $delegate => {
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, $rootScope, _authService_) => {
                $compile = _$compile_;
                $log = _$log_;
                authService = _authService_;
                authService.hasAnyRole.and.returnValue(true);

                scope = $rootScope.$new();
                scope.complaint = mock.complaing;
                scope.isEditing = false;
                scope.onCancel = jasmine.createSpy('onCancel');
                scope.onSave = jasmine.createSpy('onSave');
                scope.onSelect = jasmine.createSpy('onSelect');
                scope.onDelete = jasmine.createSpy('onDelete');

                el = angular.element('<chpl-surveillance-complaint complaints="complaints" complaint="complaint" mode="select" complaint-types="complaintTypes" complaint-status-types="complaintStatusTypes" certification-bodies="certificationBodies" on-cancel="onCancel()" on-save="onSave(complaint)" on-delete="onDelete(complaint)" on-select="onSelect(complaint)"></chpl-surveillance-complaint>');

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
                expect(ctrl).toEqual(jasmine.any(Object));
            });

            it('should call onCancel when cancelled', () => {
                ctrl.cancelEdit();
                expect(scope.onCancel).toHaveBeenCalled();
            });

            it('should send data back on save ', () => {
                let complaint = {id: 1};
                ctrl.saveComplaint(complaint);
                expect(scope.onSave).toHaveBeenCalledWith(complaint);
            });

            it('should send data back to delete ', () => {
                let complaint = {id: 1};
                ctrl.deleteComplaint(complaint);
                expect(scope.onDelete).toHaveBeenCalledWith(complaint);
            });

            it('should send data back on select ', () => {
                let complaint = {id: 1};
                ctrl.selectComplaint(complaint);
                expect(scope.onSelect).toHaveBeenCalledWith(complaint);
            });
        });
    });
})();

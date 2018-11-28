(function () {
    'use strict';

    fdescribe('the api survey component', () => {
        var $compile, $log, authService, ctrl, el, scope;

        beforeEach(() => {
            angular.mock.module('chpl.admin', ($provide) => {
                $provide.decorator('authService', ($delegate) => {
                    $delegate.getToken = jasmine.createSpy('getToken');
                    $delegate.getApiKey = jasmine.createSpy('getApiKey');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, $rootScope, _authService_) => {
                $compile = _$compile_;
                $log = _$log_;
                authService = _authService_;
                authService.getToken.and.returnValue('token');
                authService.getApiKey.and.returnValue('api-key');

                scope = $rootScope.$new();
                el = angular.element('<ai-api-survey-management></ai-api-survey-management');
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

        it('should be compiled',() => {
            expect(el.html()).not.toEqual(null);
        });

        it('should have isolate scope object with instanciate members', () => {
            expect(ctrl).toEqual(jasmine.any(Object));
        });

        describe('when setting the accuracy date', () => {
            beforeEach(() => {
                ctrl.uploader.upload = jasmine.createSpy('upload');
            });

            it('should append the date as a request parameter', () => {
                ctrl.accurateAsOfDateObject = new Date('2018-11-28');
                ctrl.setAccurateDate(ctrl.uploader);
                expect(ctrl.uploader.url).toBe('/rest/files/api_documentation?file_upload_date=1543363200000');
            });

            it('should call the upload function', () => {
                ctrl.setAccurateDate(ctrl.uploader);
                expect(ctrl.uploader.upload).toHaveBeenCalled();
            });
        });
    });
})();

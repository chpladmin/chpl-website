(() => {
    'use strict';

    describe('the api documentation component', () => {
        var $compile, $log, $q, Upload, authService, ctrl, el, mock, scope;

        beforeEach(() => {
            mock = {
                baseData: {
                    url: '/rest/files/api_documentation',
                    headers: {
                        Authorization: 'Bearer token',
                        'API-Key': 'api-key',
                    },
                    data: {
                        file: 'file',
                    },
                },
            };
            angular.mock.module('chpl.admin', $provide => {
                $provide.decorator('Upload', $delegate => {
                    $delegate.upload = jasmine.createSpy('upload');
                    return $delegate;
                });
                $provide.decorator('authService', $delegate => {
                    $delegate.getToken = jasmine.createSpy('getToken');
                    $delegate.getApiKey = jasmine.createSpy('getApiKey');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _Upload_, _authService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                Upload = _Upload_;
                Upload.upload.and.returnValue($q.when({}));
                authService = _authService_;
                authService.getToken.and.returnValue('token');
                authService.getApiKey.and.returnValue('api-key');

                scope = $rootScope.$new();
                el = angular.element('<ai-api-documentation-management></ai-api-documentation-management');
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

        describe('when uploading', () => {
            it('should not do anything without both a file and a date', () => {
                ctrl.file = undefined;
                ctrl.accurateAsOfDateObject = undefined;
                ctrl.upload();
                expect(Upload.upload).not.toHaveBeenCalled();
                ctrl.accurateAsOfDateObject = 3;
                ctrl.upload();
                expect(Upload.upload).not.toHaveBeenCalled();
                ctrl.file = 'file';
                ctrl.upload();
                expect(Upload.upload).toHaveBeenCalledWith(mock.baseData);
            });

            describe('when the date is valid', () => {
                let data;
                beforeEach(() => {
                    data = angular.copy(mock.baseData);
                    ctrl.file = 'file';
                });

                it('should handle objects', () => {
                    ctrl.accurateAsOfDateObject = new Date(33);
                    data.url = data.url + '?file_update_date=33';
                    ctrl.upload();
                    expect(Upload.upload).toHaveBeenCalledWith(data);
                });

                it('should handle strings', () => {
                    ctrl.accurateAsOfDateObject = '2018-11-28';
                    data.url = data.url + '?file_update_date=1543363200000';
                    ctrl.upload();
                    expect(Upload.upload).toHaveBeenCalledWith(data);
                });
            });

            describe('in response to the upload', () => {
                let response;
                beforeEach(() => {
                    ctrl.file = {
                        name: 'name',
                    };
                    response = {
                        data: {
                            fileName: 'filename',
                            errorMessages: undefined,
                        },
                    };
                });

                it('should handle success', () => {
                    Upload.upload.and.returnValue($q.when(response));
                    ctrl.upload();
                    scope.$digest();
                    expect(ctrl.uploadMessage).toBe('File "filename" was uploaded successfully.');
                    expect(ctrl.uploadErrors).toEqual([]);
                    expect(ctrl.uploadSuccess).toBe(true);
                });

                it('should handle failure', () => {
                    response.data.errorMessages = [1];
                    Upload.upload.and.returnValue($q.reject(response));
                    ctrl.upload();
                    scope.$digest();
                    expect(ctrl.uploadMessage).toBe('File "filename" was not uploaded successfully.');
                    expect(ctrl.uploadErrors).toEqual([1]);
                    expect(ctrl.uploadSuccess).toBe(false);
                });
            });
        });
    });
})();

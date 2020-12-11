(() => {
    'use strict';

    describe('the Upload Real World Testing component', () => {
        var $compile, $log, $q, Upload, authService, ctrl, el, mock, scope;

        mock = {
            baseData: {
                url: '/rest/real-world-testing/upload',
                headers: {
                    Authorization: 'Bearer token',
                    'API-Key': 'api-key',
                },
                data: {
                    file: 'file',
                },
            },
        };

        beforeEach(() => {
            angular.mock.module('chpl.mock', 'chpl.components', $provide => {
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
                scope.onChange = jasmine.createSpy('onChange');
                el = angular.element('<chpl-upload-real-world-testing on-change="onChange()"></chpl-upload-real-world-testing>');

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

            describe('when uploading', () => {
                it('should not do anything without a file', () => {
                    ctrl.file = undefined;
                    ctrl.upload();
                    expect(Upload.upload).not.toHaveBeenCalled();
                    ctrl.file = 'file';
                    ctrl.upload();
                    expect(Upload.upload).toHaveBeenCalledWith(mock.baseData);
                });

                describe('in response to the upload', () => {
                    let response;
                    beforeEach(() => {
                        ctrl.file = {
                            name: 'name',
                        };
                        response = {
                            data: { },
                            config: { data: { file: { name: 'filename' }}},
                        };
                    });

                    it('should handle success of a large file', () => {
                        response.data.email = 'abc@company.com';
                        response.data.fileName = 'filename';
                        Upload.upload.and.returnValue($q.when(response));
                        ctrl.upload();
                        scope.$digest();
                        expect(ctrl.uploadMessage).toBe('File "filename" was uploaded successfully. The file will be processed and an email will be sent to abc@company.com when processing is complete.');
                        expect(ctrl.uploadErrors).toEqual([]);
                        expect(ctrl.uploadSuccess).toBe(true);
                        expect(scope.onChange).toHaveBeenCalled();
                    });

                    it('should handle failure', () => {
                        response.data.errorMessages = [1];
                        Upload.upload.and.returnValue($q.reject(response));
                        ctrl.upload();
                        scope.$digest();
                        expect(ctrl.uploadMessage).toBe('File "filename" was not uploaded successfully.');
                        expect(ctrl.uploadErrors).toEqual([1]);
                        expect(ctrl.uploadSuccess).toBe(false);
                        expect(scope.onChange).not.toHaveBeenCalled();
                    });
                });
            });
        });
    });
})();

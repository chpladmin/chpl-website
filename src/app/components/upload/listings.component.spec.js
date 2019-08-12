(() => {
    'use strict';

    fdescribe('the Upload Listing component', () => {
        var $compile, $log, $q, Upload, authService, ctrl, el, mock, networkService, scope;

        mock = {
            baseData: {
                url: '/rest/certified_products/upload',
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
                $provide.decorator('networkService', $delegate => {
                    $delegate.getUploadTemplateVersions = jasmine.createSpy('getUploadTemplateVersions');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _Upload_, _authService_, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                Upload = _Upload_;
                Upload.upload.and.returnValue($q.when({}));
                authService = _authService_;
                authService.getToken.and.returnValue('token');
                authService.getApiKey.and.returnValue('api-key');
                networkService = _networkService_;
                networkService.getUploadTemplateVersions.and.returnValue($q.when({}));

                scope = $rootScope.$new();
                scope.onChange = jasmine.createSpy('onChange');
                el = angular.element('<chpl-upload-listings on-change="onChange()"></chpl-upload-listings>');

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
                            data: {
                                errorMessages: undefined,
                            },
                            config: { data: { file: { name: 'filename' }}},
                            headers: {},
                        };
                    });

                    it('should handle success', () => {
                        response.data.pendingCertifiedProducts = [1, 2]
                        Upload.upload.and.returnValue($q.when(response));
                        ctrl.upload();
                        scope.$digest();
                        expect(ctrl.uploadMessage).toBe('File "filename" was uploaded successfully. 2 pending products are ready for confirmation.');
                        expect(ctrl.uploadErrors).toEqual([]);
                        expect(ctrl.uploadSuccess).toBe(true);
                        expect(scope.onChange).toHaveBeenCalled();
                    });

                    it('should handle a deprecated template', () => {
                        response.headers.warning = '299 - "Deprecated upload template"';
                        response.data.pendingCertifiedProducts = [1, 2]
                        Upload.upload.and.returnValue($q.when(response));
                        ctrl.upload();
                        scope.$digest();
                        expect(ctrl.uploadWarnings[0]).toEqual('The version of the upload file you used is still valid, but has been deprecated. It will be removed as a valid format in the future. A newer version of the upload file is available.');
                    });

                    it('should handle failure', () => {
                        response.data.errorMessages = ['An error is here'];
                        Upload.upload.and.returnValue($q.reject(response));
                        ctrl.upload();
                        scope.$digest();
                        expect(ctrl.uploadMessage).toBe('File "filename" was not uploaded successfully.');
                        expect(ctrl.uploadErrors).toEqual(['An error is here']);
                        expect(ctrl.uploadSuccess).toBe(false);
                        expect(scope.onChange).not.toHaveBeenCalled();
                    });
                });
            });
        });
    });
})();

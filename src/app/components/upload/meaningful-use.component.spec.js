(() => {
    'use strict';

    fdescribe('the Upload Meaningful Use component', () => {
        var $compile, $log, $q, $state, Upload, authService, ctrl, el, scope;

        var mock = {};
        mock.muuAccurateAsOfDate = new Date('2017-01-13');
        mock.newMuuAccurateDate = new Date('2017-02-25');
        mock.results = [
            { id: 'fake', created: 1411117127000, products: '1;2;3'},
        ];
        mock.baseData = {
            url: '/rest/meaningful_use/upload',
            headers: {
                Authorization: 'Bearer token',
                'API-Key': 'api-key',
            },
            data: {
                file: 'file',
            },
        };

        beforeEach(() => {
            angular.mock.module('chpl.components', $provide => {
                $provide.decorator('$state', $delegate => {
                    $delegate.go = jasmine.createSpy('go');
                    return $delegate;
                });
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

            inject((_$compile_, _$log_, _$q_, $rootScope, _$state_, _Upload_, _authService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                $state = _$state_;
                $state.go.and.returnValue({});
                Upload = _Upload_;
                Upload.upload.and.returnValue($q.when({}));
                authService = _authService_;
                authService.getToken.and.returnValue('token');
                authService.getApiKey.and.returnValue('api-key');

                el = angular.element('<chpl-upload-meaningful-use></chpl-upload-meaningful-use');

                scope = $rootScope.$new()
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

        describe('template', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', () => {
            it('should have isolate scope object with instanciate members', () => {
                expect(ctrl).toEqual(jasmine.any(Object));
            });

            describe('when uploading', () => {
                it('should not do anything without both a file and a date', () => {
                    ctrl.file = undefined;
                    ctrl.muuAccurateAsOfDateObject = undefined;
                    ctrl.upload();
                    expect(Upload.upload).not.toHaveBeenCalled();
                    ctrl.muuAccurateAsOfDateObject = 3;
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
                        ctrl.muuAccurateAsOfDateObject = new Date(33);
                        data.url = data.url + '?accurate_as_of=33';
                        ctrl.upload();
                        expect(Upload.upload).toHaveBeenCalledWith(data);
                    });

                    it('should handle strings', () => {
                        ctrl.muuAccurateAsOfDateObject = '2018-11-28';
                        data.url = data.url + '?accurate_as_of=1543363200000';
                        ctrl.upload();
                        expect(Upload.upload).toHaveBeenCalledWith(data);
                    });
                });

                xdescribe('in response to the upload', () => {
                    let response;
                    beforeEach(() => {
                        ctrl.file = {
                            name: 'name',
                        };
                        ctrl.muuAccurateAsOfDateObject = '2018-11-28';
                        response = {
                            data: {
                                error: undefined,
                                errorMessages: undefined,
                            },
                            config: { data: { file: 'filename' }},
                        };
                    });

                    it('should handle success', () => {
                        Upload.upload.and.returnValue($q.when(response));
                        ctrl.upload();
                        scope.$digest();
                        expect($state.go).toHaveBeenCalledWith('/admin/jobsManagement');
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

                    it('should handle failure', () => {
                        response.data.error = 'an error';
                        Upload.upload.and.returnValue($q.reject(response));
                        ctrl.upload();
                        scope.$digest();
                        expect(ctrl.uploadMessage).toBe('File "filename" was not uploaded successfully.');
                        expect(ctrl.uploadErrors).toEqual(['an error']);
                        expect(ctrl.uploadSuccess).toBe(false);
                    });
                });
            });
        });
    });
})();

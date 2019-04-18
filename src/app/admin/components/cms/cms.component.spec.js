(() => {
    'use strict';

    describe('the cms component', () => {
        var $compile, $location, $log, $q, Upload, authService, ctrl, el, networkService, scope;

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
            angular.mock.module('chpl', 'chpl.admin', $provide => {
                $provide.decorator('$location', $delegate => {
                    $delegate.url = jasmine.createSpy('url');
                    return $delegate;
                });
                $provide.decorator('Upload', $delegate => {
                    $delegate.upload = jasmine.createSpy('upload');
                    return $delegate;
                });
                $provide.decorator('authService', $delegate => {
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    $delegate.getToken = jasmine.createSpy('getToken');
                    $delegate.getApiKey = jasmine.createSpy('getApiKey');
                    return $delegate;
                });
                $provide.decorator('networkService', $delegate => {
                    $delegate.getCmsDownload = jasmine.createSpy('getCmsDownload');
                    return $delegate;
                });
            });

            inject((_$compile_, _$location_, _$log_, _$q_, $rootScope, _Upload_, _authService_, _networkService_) => {
                $compile = _$compile_;
                $q = _$q_;
                $location = _$location_;
                $location.url.and.returnValue({});
                $log = _$log_;
                Upload = _Upload_;
                Upload.upload.and.returnValue($q.when({}));
                authService = _authService_;
                authService.hasAnyRole.and.returnValue(true);
                authService.getToken.and.returnValue('token');
                authService.getApiKey.and.returnValue('api-key');
                networkService = _networkService_;
                networkService.getCmsDownload.and.returnValue($q.when(mock.results));

                el = angular.element('<ai-cms-management></ai-cms-management>');

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

            describe('when getting the download file', () => {
                it('should load without getting the data', () => {
                    expect(ctrl.isReady).toBe(false);
                    expect(ctrl.isProcessing).toBe(false);
                    expect(networkService.getCmsDownload).not.toHaveBeenCalled();
                });

                it('should set "isProcessing" when loading', () => {
                    ctrl.getDownload();
                    expect(ctrl.isProcessing).toBe(true);
                });

                it('should set "isReady" and "isProcessing" when done loading', () => {
                    ctrl.getDownload();
                    scope.$digest();
                    expect(ctrl.isProcessing).toBe(false);
                    expect(ctrl.isReady).toBe(true);
                });

                it('should set the cmsArray', () => {
                    ctrl.getDownload();
                    scope.$digest();
                    expect(ctrl.cmsArray.length).toBe(1);
                });

                it('should format the dates', () => {
                    ctrl.getDownload();
                    scope.$digest();
                    expect(ctrl.cmsArray[0].created).toBe('2014-09-19');
                });

                it('should not put the third column in for CMS users', () => {
                    expect(ctrl.csvHeader.length).toBe(3);
                    authService.hasAnyRole.and.returnValue(false);
                    el = angular.element('<ai-cms-management></ai-cms-management>');
                    $compile(el)(scope);
                    scope.$digest();
                    ctrl = el.isolateScope().$ctrl;
                    expect(ctrl.csvHeader.length).toBe(2);
                });
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
                    let data;
                    beforeEach(() => {
                        data = angular.copy(mock.baseData);
                        ctrl.muuAccurateAsOfDateObject = '2018-11-28';
                        ctrl.file = {
                            name: 'name',
                        };
                    });

                    it('should handle success', () => {
                        Upload.upload.and.returnValue($q.when(data));
                        ctrl.upload();
                        scope.$digest();
                        expect($location.url).toHaveBeenCalledWith('/admin/jobsManagement');
                    });

                    it('should handle failure', () => {
                        Upload.upload.and.returnValue($q.reject(data));
                        ctrl.upload();
                        scope.$digest();
                        expect(ctrl.uploadMessage).toBe('File "name" was not uploaded successfully.');
                        expect(ctrl.uploadErrors).toEqual([1]);
                        expect(ctrl.uploadSuccess).toBe(false);
                    });
                });
            });
        });
    });
})();

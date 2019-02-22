(() => {
    'use strict';

    describe('the cms component', () => {
        var $compile, $location, $log, $q, authService, ctrl, el, networkService, scope;

        var mock = {};
        mock.muuAccurateAsOfDate = new Date('2017-01-13');
        mock.newMuuAccurateDate = new Date('2017-02-25');
        mock.results = [
            { id: 'fake', created: 1411117127000, products: '1;2;3'},
        ];

        beforeEach(() => {
            angular.mock.module('chpl', 'chpl.admin', $provide => {
                $provide.decorator('networkService', $delegate => {
                    $delegate.getCmsDownload = jasmine.createSpy('getCmsDownload');
                    return $delegate;
                });
                $provide.decorator('authService', $delegate => {
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    $delegate.getToken = jasmine.createSpy('getToken');
                    $delegate.getApiKey = jasmine.createSpy('getApiKey');
                    return $delegate;
                });
                $provide.decorator('$location', $delegate => {
                    $delegate.url = jasmine.createSpy('url');
                    return $delegate;
                });
            });

            inject((_$compile_, _$location_, _$log_, _$q_, $rootScope, _authService_, _networkService_) => {
                $compile = _$compile_;
                $q = _$q_;
                $location = _$location_;
                $location.url.and.returnValue({});
                $log = _$log_;
                networkService = _networkService_;
                networkService.getCmsDownload.and.returnValue($q.when(mock.results));
                authService = _authService_;
                authService.hasAnyRole.and.returnValue(true);
                authService.getToken.and.returnValue('token');
                authService.getApiKey.and.returnValue('api-key');

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

            describe('when concerned with the accurate as of date', () => {
                let item;
                let upload;
                let dte;
                beforeEach(() => {
                    upload = jasmine.createSpy('upload');
                    dte = 1550066637444;
                    ctrl.muuAccurateAsOfDateObject = new Date(dte);
                    item = {
                        upload: upload,
                        url: 'url',
                    };
                });

                it('should set the uploader url', () => {
                    ctrl.uploader.url = 'url';
                    ctrl.setAccurateDate(item);
                    expect(ctrl.uploader.url).toBe('url?accurate_as_of=1550066637444');
                });

                it('should set the item url', () => {
                    ctrl.setAccurateDate(item);
                    expect(item.url).toBe('url?accurate_as_of=1550066637444');
                });

                it('should call the item upload function', () => {
                    ctrl.setAccurateDate(item);
                    expect(upload).toHaveBeenCalled();
                });
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

            describe('when using the file uploader', () => {
                it('should display errors on failure', () => {
                    const fileItem = { file: { name: 'filename' } };
                    const response = { errorMessages: 'messages' };
                    ctrl.uploader.onErrorItem(fileItem, response);
                    expect(ctrl.uploadMessage).toBe('File "filename" was not uploaded successfully.');
                    expect(ctrl.uploadErrors).toBe('messages');
                    expect(ctrl.uploadSuccess).toBe(false);
                });

                it('should redirect to jobs management on success', () => {
                    ctrl.uploader.onSuccessItem();
                    expect($location.url).toHaveBeenCalledWith('/admin/jobsManagement');
                });
            });
        });
    });
})();

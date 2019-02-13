(() => {
    'use strict';

    fdescribe('the cms directive', () => {
        var $compile, $location, $log, $q, authService, el, networkService, scope, vm;

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
                vm = el.isolateScope().vm;
            });
        });

        afterEach(() => {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        it('should be compiled', () => {
            expect(el.html()).not.toEqual(null);
        });

        it('should have isolate scope object with instanciate members', () => {
            expect(vm).toEqual(jasmine.any(Object));
        });

        describe('when concerned with the accurate as of date', () => {
            let item;
            let upload;
            let dte;
            beforeEach(() => {
                upload = jasmine.createSpy('upload');
                dte = 1550066637444;
                vm.muuAccurateAsOfDateObject = new Date(dte);
                item = {
                    upload: upload,
                    url: 'url',
                };
            });

            it('should set the uploader url', () => {
                vm.uploader.url = 'url';
                vm.setAccurateDate(item);
                expect(vm.uploader.url).toBe('url?accurate_as_of=1550066637444');
            });

            it('should set the item url', () => {
                vm.setAccurateDate(item);
                expect(item.url).toBe('url?accurate_as_of=1550066637444');
            });

            it('should call the item upload function', () => {
                vm.setAccurateDate(item);
                expect(upload).toHaveBeenCalled();
            });
        });

        describe('when getting the download file', () => {
            it('should load without getting the data', () => {
                expect(vm.isReady).toBe(false);
                expect(vm.isProcessing).toBe(false);
                expect(networkService.getCmsDownload).not.toHaveBeenCalled();
            });

            it('should set "isProcessing" when loading', () => {
                vm.getDownload();
                expect(vm.isProcessing).toBe(true);
            });

            it('should set "isReady" and "isProcessing" when done loading', () => {
                vm.getDownload();
                scope.$digest();
                expect(vm.isProcessing).toBe(false);
                expect(vm.isReady).toBe(true);
            });

            it('should set the cmsArray', () => {
                vm.getDownload();
                scope.$digest();
                expect(vm.cmsArray.length).toBe(1);
            });

            it('should format the dates', () => {
                vm.getDownload();
                scope.$digest();
                expect(vm.cmsArray[0].created).toBe('2014-09-19');
            });

            it('should not put the third column in for CMS users', () => {
                expect(vm.csvHeader.length).toBe(3);
                authService.hasAnyRole.and.returnValue(false);
                el = angular.element('<ai-cms-management></ai-cms-management>');
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
                expect(vm.csvHeader.length).toBe(2);
            });
        });

        describe('when using the file uploader', () => {
            it('should display errors on failure', () => {
                const fileItem = { file: { name: 'filename' } };
                const response = { errorMessages: 'messages' };
                vm.uploader.onErrorItem(fileItem, response);
                expect(vm.uploadMessage).toBe('File "filename" was not uploaded successfully.');
                expect(vm.uploadErrors).toBe('messages');
                expect(vm.uploadSuccess).toBe(false);
            });

            it('should redirect to jobs management on success', () => {
                vm.uploader.onSuccessItem();
                expect($location.url).toHaveBeenCalledWith('/admin/jobsManagement');
            });
        });
    });
})();

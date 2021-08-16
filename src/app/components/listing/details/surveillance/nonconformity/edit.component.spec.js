(() => {
  'use strict';

  describe('the surveillance nonconformity edit component', () => {
    var $compile, $log, $q, Upload, authService, ctrl, el, mock, networkService, scope;

    beforeEach(() => {
      mock = {
        baseData: {
          url: '/rest/surveillance/1/nonconformity/undefined/document',
          headers: {
            Authorization: 'Bearer token',
            'API-Key': 'api-key',
          },
          data: {
            file: 'file',
          },
        },
      };

      angular.mock.module('chpl.components', $provide => {
        $provide.decorator('Upload', $delegate => {
          $delegate.upload = jasmine.createSpy('upload');
          return $delegate;
        });
        $provide.decorator('authService', $delegate => {
          $delegate.getApiKey = jasmine.createSpy('getApiKey');
          $delegate.getToken = jasmine.createSpy('getToken');
          return $delegate;
        });
        $provide.decorator('networkService', $delegate => {
          $delegate.deleteSurveillanceDocument = jasmine.createSpy('deleteSurveillanceDocument');
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
        authService.getApiKey.and.returnValue('api-key');
        authService.getToken.and.returnValue('token');
        networkService = _networkService_;
        networkService.deleteSurveillanceDocument.and.returnValue($q.when({}));

        el = angular.element('<ai-surveillance-nonconformity-edit close="close($value)" dismiss="dismiss()" resolve="resolve"></ai-surveillance-nonconformity-edit>');

        scope = $rootScope.$new();
        scope.close = jasmine.createSpy('close');
        scope.dismiss = jasmine.createSpy('dismiss');
        scope.resolve = {
          disableValidation: false,
          nonconformity: {},
          randomized: false,
          randomizedSitesUsed: undefined,
          requirementId: 1,
          surveillanceId: 1,
          surveillanceTypes: {
            nonconformityTypes: { data: [] },
          },
          workType: 'create',
        };
        $compile(el)(scope);
        scope.$digest();
        ctrl = el.isolateScope().$ctrl;
      });
    });

    afterEach(() => {
      if ($log.debug.logs.length > 0) {
        /* eslint-disable no-console,angular/log */
        console.debug('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
        /* eslint-enable no-console,angular/log */
      }
    });

    describe('template', () => {
      it('should be compiled', () => {
        expect(el.html()).not.toEqual(null);
      });
    });

    describe('controller', () => {
      it('should exist', () => {
        expect(ctrl).toBeDefined();
      });

      it('should be able close it\'s own modal', () => {
        expect(ctrl.cancel).toBeDefined();
        ctrl.cancel();
        expect(scope.dismiss).toHaveBeenCalled();
      });

      it('should convert dateTime longs to javascript objects on load', () => {
        var aDate = new Date('1/1/2003');
        var nc = {
          dateOfDetermination: aDate.getTime(),
          capApprovalDate: aDate.getTime(),
          capStartDate: aDate.getTime(),
          capEndDate: aDate.getTime(),
          capMustCompleteDate: aDate.getTime(),
        };
        scope.resolve = {
          disableValidation: false,
          nonconformity: nc,
          randomized: false,
          randomizedSitesUsed: undefined,
          requirementId: 1,
          surveillanceId: 1,
          surveillanceTypes: {
            nonconformityTypes: { data: [] },
          },
          workType: 'create',
        };
        el = angular.element('<ai-surveillance-nonconformity-edit close="close()" dismiss="dismiss()" resolve="resolve"></ai-surveillance-nonconformity-edit>');
        $compile(el)(scope);
        scope.$digest();
        ctrl = el.isolateScope().$ctrl;
        expect(ctrl.nonconformity.dateOfDeterminationObject).toEqual(aDate);
        expect(ctrl.nonconformity.capApprovalDateObject).toEqual(aDate);
        expect(ctrl.nonconformity.capStartDateObject).toEqual(aDate);
        expect(ctrl.nonconformity.capEndDateObject).toEqual(aDate);
        expect(ctrl.nonconformity.capMustCompleteDateObject).toEqual(aDate);
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
            ctrl.accurateAsOfDateObject = '2018-11-28';
            ctrl.nonconformity.documents = [];
            response = {
              data: {
                fileName: 'filename',
                errorMessages: undefined,
              },
              config: {
                data: {
                  file: {
                    name: 'filename',
                  },
                },
              },
            };
          });

          it('should mark the uploaded document as pending', () => {
            Upload.upload.and.returnValue($q.when(response));
            ctrl.upload();
            scope.$digest();
            expect(ctrl.nonconformity.documents[0]).toEqual({
              fileName: 'filename is pending',
              fileType: undefined,
            });
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
            response.data.errorMessages = 1;
            Upload.upload.and.returnValue($q.reject(response));
            ctrl.upload();
            scope.$digest();
            expect(ctrl.uploadMessage).toBe('File "filename" was not uploaded successfully.');
            expect(ctrl.uploadErrors).toEqual([1]);
            expect(ctrl.uploadSuccess).toBe(false);
          });
        });
      });

      describe('when deleting a document', () => {
        beforeEach(() => {
          ctrl.surveillanceId = 1;
          ctrl.nonconformity = { id: 2 };
          ctrl.nonconformity.documents = [
            { id: 1 },
            { id: 2 },
            { id: 3 },
          ];
        });

        it('should call the common service', () => {
          ctrl.deleteDoc(3);
          scope.$digest();
          expect(networkService.deleteSurveillanceDocument).toHaveBeenCalledWith(1, 3);
        });

        it('should remove the deleted document from the list', () => {
          ctrl.deleteDoc(3);
          scope.$digest();
          expect(ctrl.nonconformity.documents.length).toBe(2);
        });

        it('should handle failure', () => {
          networkService.deleteSurveillanceDocument.and.returnValue($q.reject({ data: {} }));
          ctrl.deleteDoc(3);
          scope.$digest();
          expect(ctrl.deleteMessage).toBe('File was not removed successfully.');
          expect(ctrl.deleteSuccess).toBe(false);
        });
      });

      describe('when saving the nonconformity', () => {
        beforeEach(() => {
          ctrl.nonconformityType = {};
        });

        it('should convert date objects to longs', () => {
          var aDate = new Date('1/1/2003');
          ctrl.nonconformity = {
            dateOfDeterminationObject: aDate,
            capApprovalDateObject: aDate,
            capStartDateObject: aDate,
            capEndDateObject: aDate,
            capMustCompleteDateObject: aDate,
          };
          expect(ctrl.nonconformity.dateOfDetermination).toBeUndefined();
          expect(ctrl.nonconformity.capApprovalDate).toBeUndefined();
          expect(ctrl.nonconformity.capStartDate).toBeUndefined();
          expect(ctrl.nonconformity.capEndDate).toBeUndefined();
          expect(ctrl.nonconformity.capMustCompleteDate).toBeUndefined();
          ctrl.save();
          expect(ctrl.nonconformity.dateOfDetermination).toBe(aDate.getTime());
          expect(ctrl.nonconformity.capApprovalDate).toBe(aDate.getTime());
          expect(ctrl.nonconformity.capStartDate).toBe(aDate.getTime());
          expect(ctrl.nonconformity.capEndDate).toBe(aDate.getTime());
          expect(ctrl.nonconformity.capMustCompleteDate).toBe(aDate.getTime());
        });

        it('should remove date values if no object exists', () => {
          ctrl.nonconformity = {
            dateOfDetermination: 'fake',
            capApprovalDate: 'fake',
            capStartDate: 'fake',
            capEndDate: 'fake',
            capMustCompleteDate: 'fake',
          };
          ctrl.save();
          expect(ctrl.nonconformity.dateOfDetermination).toBe(null);
          expect(ctrl.nonconformity.capApprovalDate).toBe(null);
          expect(ctrl.nonconformity.capStartDate).toBe(null);
          expect(ctrl.nonconformity.capEndDate).toBe(null);
          expect(ctrl.nonconformity.capMustCompleteDate).toBe(null);
        });

        it('should close it\'s modal with the NC', () => {
          ctrl.nonconformity = { id: 'an NC' };
          ctrl.save();
          expect(scope.close).toHaveBeenCalled();
        });
      });
    });
  });
})();

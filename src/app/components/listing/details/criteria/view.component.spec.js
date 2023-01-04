(() => {
  describe('the Certification Criteria View component', () => {
    let $analytics;
    let $compile;
    let $log;
    let $uibModal;
    let Mock;
    let actualOptions;
    let ctrl;
    let el;
    let scope;

    const mock = {
      cert: {
        id: 1,
        criterion: {
          number: 'initial cert',
          title: 'a title',
        },
      },
    };

    beforeEach(() => {
      angular.mock.module('chpl.mock', 'chpl.components');

      inject((_$analytics_, _$compile_, _$log_, $rootScope, _$uibModal_, _Mock_) => {
        $analytics = _$analytics_;
        $compile = _$compile_;
        $log = _$log_;
        Mock = _Mock_;
        $uibModal = _$uibModal_;
        spyOn($uibModal, 'open').and.callFake((options) => {
          actualOptions = options;
          return Mock.fakeModal;
        });

        scope = $rootScope.$new();
        scope.cert = mock.cert;
        scope.refreshSed = jasmine.createSpy('refreshSed');
        scope.resources = {};
        scope.isConfirming = false;

        el = angular.element('<chpl-certification-criteria cert="cert" refresh-sed="refreshSed()" resources="resources" is-confirming="isConfirming"></chpl-certification-criteria>');

        $compile(el)(scope);
        scope.$digest();
        ctrl = el.isolateScope().$ctrl;
      });
    });

    afterEach(() => {
      if ($log.debug.logs.length > 0) {
        /* eslint-disable no-console,angular/log */
        console.log(`Debug:\n${$log.debug.logs.map((o) => angular.toJson(o)).join('\n')}`);
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

      describe('when asked about phantom data', () => {
        it('should not indicate any if the cert has success=true', () => {
          ctrl.cert.success = true;
          expect(ctrl.hasPhantomData()).toBe(false);
        });

        describe('and the cert has success=false', () => {
          beforeEach(() => {
            ctrl.cert = { success: false };
          });

          it('should analyze additionalSoftware', () => {
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.additionalSoftware = [];
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.additionalSoftware = [1];
            expect(ctrl.hasPhantomData()).toBe(true);
          });

          it('should analyze apiDocumentation', () => {
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.apiDocumentation = '';
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.apiDocumentation = 'something fake';
            expect(ctrl.hasPhantomData()).toBe(true);
          });

          it('should analyze g1MacraMeasures', () => {
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.g1MacraMeasures = [];
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.g1MacraMeasures = [1];
            expect(ctrl.hasPhantomData()).toBe(false);
          });

          it('should analyze g1Success', () => {
            ctrl.cert.g1Success = null;
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.g1Success = false;
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.g1Success = true;
            expect(ctrl.hasPhantomData()).toBe(false);
          });

          it('should analyze g2MacraMeasures', () => {
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.g2MacraMeasures = [];
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.g2MacraMeasures = [1];
            expect(ctrl.hasPhantomData()).toBe(false);
          });

          it('should analyze g2Success', () => {
            ctrl.cert.g2Success = null;
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.g2Success = false;
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.g2Success = true;
            expect(ctrl.hasPhantomData()).toBe(false);
          });

          it('should analyze gap', () => {
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.gap = false;
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.gap = true;
            expect(ctrl.hasPhantomData()).toBe(true);
          });

          it('should analyze privacySecurityFramework', () => {
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.privacySecurityFramework = '';
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.privacySecurityFramework = 'something fake';
            expect(ctrl.hasPhantomData()).toBe(true);
          });

          it('should analyze sed', () => {
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.sed = false;
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.sed = true;
            expect(ctrl.hasPhantomData()).toBe(true);
          });

          it('should analyze testDataUsed', () => {
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.testDataUsed = [];
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.testDataUsed = [1];
            expect(ctrl.hasPhantomData()).toBe(true);
          });

          it('should analyze functionalitiesTested', () => {
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.functionalitiesTested = [];
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.functionalitiesTested = [1];
            expect(ctrl.hasPhantomData()).toBe(true);
          });

          it('should analyze testProcedures', () => {
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.testProcedures = [];
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.testProcedures = [1];
            expect(ctrl.hasPhantomData()).toBe(true);
          });

          it('should analyze testStandards', () => {
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.testStandards = [];
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.testStandards = [1];
            expect(ctrl.hasPhantomData()).toBe(true);
          });

          it('should analyze testToolsUsed', () => {
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.testToolsUsed = [];
            expect(ctrl.hasPhantomData()).toBe(false);
            ctrl.cert.testToolsUsed = [1];
            expect(ctrl.hasPhantomData()).toBe(true);
          });
        });
      });

      describe('when editing the certification', () => {
        let modalOptions;
        beforeEach(() => {
          modalOptions = {
            component: 'chplCertificationCriteriaEdit',
            animation: false,
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
              cert: jasmine.any(Function),
              hasIcs: jasmine.any(Function),
              isConfirming: jasmine.any(Function),
              resources: jasmine.any(Function),
            },
          };
        });

        it('should create a modal instance', () => {
          expect(ctrl.editUibModalInstance).toBeUndefined();
          ctrl.editCert();
          expect(ctrl.editUibModalInstance).toBeDefined();
        });

        it('should resolve elements', () => {
          const hasIcs = true;
          const resources = {};
          ctrl.hasIcs = hasIcs;
          ctrl.resources = resources;
          ctrl.editCert();
          expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
          expect(actualOptions.resolve.cert()).toEqual(ctrl.cert);
          expect(actualOptions.resolve.hasIcs()).toEqual(hasIcs);
          expect(actualOptions.resolve.resources()).toEqual(resources);
        });

        it('should restore the cert if cancelled', () => {
          ctrl.editCert();
          ctrl.cert = { id: 2, name: 'an edited cert' };
          ctrl.editUibModalInstance.dismiss();
          expect(ctrl.cert).toEqual(mock.cert);
        });

        it('should refresh SED after editing', () => {
          const initCount = scope.refreshSed.calls.count();
          ctrl.editCert();
          ctrl.editUibModalInstance.close({ id: 2, name: 'an edited cert' });
          expect(scope.refreshSed.calls.count()).toBe(initCount + 1);
        });
      });

      describe('when toggling a criteria', () => {
        it('should flip from viewing to hiding', () => {
          expect(ctrl.showDetails).toBeFalsy();
          ctrl.toggleCriteria();
          expect(ctrl.showDetails).toBe(true);
          ctrl.toggleCriteria();
          expect(ctrl.showDetails).toBe(false);
        });

        it('should track analytics only when it opens', () => {
          spyOn($analytics, 'eventTrack');
          ctrl.toggleCriteria();
          expect($analytics.eventTrack).toHaveBeenCalledWith(
            'Viewed criteria details', { category: 'Listing Details', label: 'initial cert' },
          );
          expect($analytics.eventTrack.calls.count()).toBe(1);
          ctrl.toggleCriteria();
          expect($analytics.eventTrack.calls.count()).toBe(1);
          ctrl.toggleCriteria();
          expect($analytics.eventTrack.calls.count()).toBe(2);
        });

        it('should track analytics of cures update criteria', () => {
          spyOn($analytics, 'eventTrack');
          ctrl.cert.criterion.title = 'something Cures Update';
          ctrl.toggleCriteria();
          expect($analytics.eventTrack).toHaveBeenCalledWith(
            'Viewed criteria details', { category: 'Listing Details', label: 'initial cert (Cures Update)' },
          );
        });
      });

      describe('when displaying the "view details" button', () => {
        it('should show when "success" is true', () => {
          ctrl.cert.success = true;
          expect(ctrl.showViewDetailsLink()).toBe(true);
        });

        describe('when "success" is false', () => {
          beforeEach(() => {
            ctrl.cert.success = false;
            ctrl.cert.g1Success = null;
            ctrl.cert.g2Success = null;
            ctrl.cert.g1MacraMeasures = undefined;
            ctrl.cert.g2MacraMeasures = undefined;
          });

          it('should show if g1Success is non-null', () => {
            ctrl.cert.g1Success = false;
            expect(ctrl.showViewDetailsLink()).toBe(true);
            ctrl.cert.g1Success = true;
            expect(ctrl.showViewDetailsLink()).toBe(true);
          });

          it('should show if g2Success is non-null', () => {
            ctrl.cert.g2Success = false;
            expect(ctrl.showViewDetailsLink()).toBe(true);
            ctrl.cert.g2Success = true;
            expect(ctrl.showViewDetailsLink()).toBe(true);
          });
        });
      });
    });
  });
})();

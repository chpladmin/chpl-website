(() => {
    'use strict';

    fdescribe('the Versions component', () => {
        var $compile, $log, ctrl, el, mock, scope;

        mock = {
            version: {
                versionId: 636, version: 'V1.', lastModifiedDate: null,
            },
            versions: [
                { version: 'a version' },
            ],
            listings: [
                { name: 'a listing' },
            ],
        };

        beforeEach(() => {
            angular.mock.module('chpl', 'chpl.organizations', $provide => {
                $provide.decorator('chplVersionsDirective', $delegate => {
                    $delegate[0].terminal = true;
                    return $delegate;
                });
                $provide.decorator('chplDeveloperDirective', $delegate => {
                    $delegate[0].controller = class {};
                    $delegate[0].terminal = true;
                    $delegate[0].template = '';
                    $delegate[0].templateUrl = undefined;
                    return $delegate;
                });
                $provide.decorator('chplProductDirective', $delegate => {
                    $delegate[0].controller = class {};
                    $delegate[0].terminal = true;
                    $delegate[0].template = '';
                    $delegate[0].templateUrl = undefined;
                    return $delegate;
                });
            });
            inject((_$compile_, _$log_, $rootScope) => {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.version = mock.version;
                scope.versions = mock.versions;
                scope.listings = mock.listings;

                el = angular.element('<chpl-versions version="version" versions="versions" listings="listings"></chpl-versions>');

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
        });
    });
})();

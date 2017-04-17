(function () {
    'use strict';

    describe('chpl.ellipsis.directive', function () {

        var element;
        var scope;
        var $log;
        var $compile;
        var ctrl;

        beforeEach(function () {
            module('chpl.templates');
            module('chpl')
        });

        beforeEach(inject(function (_$compile_, $rootScope, _$log_) {
            $compile = _$compile_;
            $log = _$log_;
            scope = $rootScope.$new();

            element = angular.element('<ai-ellipsis text="Some amount of long text here" max-length="10"></ai-ellipsis>');
            $compile(element)(scope);
            scope.$digest();
            ctrl = element.controller('aiEllipsis');
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.log('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        describe('controller', function () {

            it('should exist', function () {
                expect(ctrl).toBeDefined();
            });

            it('should have shorter display text', function () {
                expect(ctrl.displayText).toBe('Some amoun');
            });

            it('should not shorten anything if it\'s already short', function () {
                element = angular.element('<ai-ellipsis text="short" max-length="10"></ai-ellipsis>');
                $compile(element)(scope);
                scope.$digest();
                ctrl = element.controller('aiEllipsis');
                expect(ctrl.displayText).toBe('short');
                expect(ctrl.isShortened).toBe(false);
            });

            it('should break on spaces if requested', function () {
                element = angular.element('<ai-ellipsis text="This text has spaces in it" max-length="10" word-boundaries="true"></ai-ellipsis>');
                $compile(element)(scope);
                scope.$digest();
                ctrl = element.controller('aiEllipsis');
                expect(ctrl.displayText).toBe('This text');
                expect(ctrl.isShortened).toBe(true);
            });

            it('should not break on spaces if requested but there aren\'t any spaces', function () {
                element = angular.element('<ai-ellipsis text="Thistexthasnospacesinit" max-length="7" word-boundaries="true"></ai-ellipsis>');
                $compile(element)(scope);
                scope.$digest();
                ctrl = element.controller('aiEllipsis');
                expect(ctrl.displayText).toBe('Thistex');
                expect(ctrl.isShortened).toBe(true);
            });
        });
    });
})();

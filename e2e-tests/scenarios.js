'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('[chpl-website]', function() {

    it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
        browser.get('index.html');
        expect(browser.getLocationAbsUrl()).toMatch("/search");
    });

    describe('view1', function() {

        beforeEach(function() {
            browser.get('index.html#/view1');
        });

        it('should render view1 when user navigates to /view1', function() {
            expect(element.all(by.css('[ng-view] p')).first().getText()).
                toMatch(/partial for view 1/);
        });
    });

    describe('view2', function() {

        beforeEach(function() {
            browser.get('index.html#/view2');
        });

        it('should render view2 when user navigates to /view2', function() {
            expect(element.all(by.css('[ng-view] p')).first().getText()).
                toMatch(/partial for view 2/);
        });
    });

    describe('[privacy view]', function () {

        beforeEach (function () {
            browser.get('index.html#/privacy');
        });

        it('should render privacy policy when user navigates to /privacy', function () {
            expect(element.all(by.css('[ng-view] h1')).first().getText())
                .toMatch('Privacy policy');
        });

        it('should have multiple paragraphs', function () {
            expect(element.all(by.css('[ng-view] p')).count())
                .toBeGreaterThan(2);
        });
    });

    describe('[search view]', function () {
        beforeEach(function () {
            browser.get('index.html#/search');
        });

        it('should render search page when user navigates to /search', function () {
            expect(element.all(by.css('[ng-view] h1')).first().getText())
                .toMatch('Welcome to the CHPL');
        });
    });
});

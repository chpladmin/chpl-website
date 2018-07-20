'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var postcss = require('gulp-postcss');
var reporter = require('postcss-reporter');
var stylelint = require('stylelint');
var scss = require('postcss-scss');

gulp.task('lint-styles', function () {
    return lintStyles();
});

var lintStyles = function () {
    var stylelintConfig = {
        plugins: [
            'stylelint-scss'
        ],
        rules: {
            'block-closing-brace-newline-after': 'always',
            'block-closing-brace-newline-before': 'always',
            'block-no-empty': true,
            'block-opening-brace-newline-after': 'always',
            'block-opening-brace-space-before': 'always',
            'color-hex-case': 'lower',
            'color-no-invalid-hex': true,
            'declaration-block-no-duplicate-properties': true,
            'declaration-block-no-shorthand-property-overrides': true,
            'declaration-block-semicolon-newline-after': 'always',
            'declaration-block-trailing-semicolon': 'always',
            'declaration-colon-space-after': 'always',
            'declaration-colon-space-before': 'never',
            'font-family-name-quotes': 'always-unless-keyword',
            'font-family-no-duplicate-names': true,
            'function-comma-space-after': 'always',
            'function-linear-gradient-no-nonstandard-direction': true,
            'function-url-quotes': 'always',
            'indentation': 4,
            'length-zero-no-unit': true,
            'max-empty-lines': 1,
            'media-feature-colon-space-after': 'always',
            'media-feature-colon-space-before': 'never',
            'media-feature-name-no-vendor-prefix': true,
            'number-leading-zero': 'never',
            'number-no-trailing-zeros': true,
            'property-no-vendor-prefix': true,
            'rule-empty-line-before': 'always',
            'selector-list-comma-newline-after': 'always',
            'selector-list-comma-space-before': 'never',
            'selector-max-universal': 0,
            'shorthand-property-no-redundant-values': true,
            'string-quotes': 'double',
            'value-no-vendor-prefix': true,
            'scss/dollar-variable-colon-space-after': 'always',
            'scss/selector-no-redundant-nesting-selector': true
        }
    }
    return gulp.src([
        path.join(conf.paths.src, '/app/**/*.scss')
    ])
        .pipe(postcss(
            [
                stylelint(stylelintConfig),
                reporter({ clearReportedMessages: true })
            ],
            {
                syntax: scss
            }
        ));
};

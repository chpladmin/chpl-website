import './product.module';

function importAll(r) {
    r.keys().forEach(r);
}

importAll(
    // including subdirectories, find all *.js files except those matching *.module.js or *.spec.js
    require.context('./', true, /^(?!.*\.module\.js$)^(?!.*\.spec\.js$)^(?!.*\.mock\.js$).*\.js$/)
);

export default angular.module('chpl.product');

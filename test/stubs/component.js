// Stands in for heavy third-party components that tests do not render.
// Kept as a valid component so module-graph imports resolve.
const React = require('react');

const StubComponent = () => React.createElement('div', { 'data-stub-component': true });

module.exports = StubComponent;
module.exports.default = StubComponent;

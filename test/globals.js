// webpack injects these via DefinePlugin (see webpack.config.js); jest needs
// them defined or any component reading them throws ReferenceError.
global.DEVELOPER_MODE = false;
global.ENABLE_LOGGING = false;

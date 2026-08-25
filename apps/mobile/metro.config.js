const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Guarantee 100% single instance of React, ReactDOM, and React Native across the entire monorepo
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react') {
    return {
      filePath: path.resolve(projectRoot, 'node_modules/react/index.js'),
      type: 'sourceFile',
    };
  }
  if (moduleName === 'react/jsx-runtime') {
    return {
      filePath: path.resolve(projectRoot, 'node_modules/react/jsx-runtime.js'),
      type: 'sourceFile',
    };
  }
  if (moduleName === 'react/jsx-dev-runtime') {
    return {
      filePath: path.resolve(projectRoot, 'node_modules/react/jsx-dev-runtime.js'),
      type: 'sourceFile',
    };
  }
  if (moduleName === 'react-dom') {
    return {
      filePath: path.resolve(projectRoot, 'node_modules/react-dom/index.js'),
      type: 'sourceFile',
    };
  }
  if (moduleName === 'react-dom/client') {
    return {
      filePath: path.resolve(projectRoot, 'node_modules/react-dom/client.js'),
      type: 'sourceFile',
    };
  }
  if (moduleName === 'react-native') {
    return {
      filePath: path.resolve(projectRoot, 'node_modules/react-native-web/dist/index.js'),
      type: 'sourceFile',
    };
  }
  if (moduleName === 'react-native-web') {
    return {
      filePath: path.resolve(projectRoot, 'node_modules/react-native-web/dist/index.js'),
      type: 'sourceFile',
    };
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;

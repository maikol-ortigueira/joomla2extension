const {
    extName,
    srcDir,
    destDir
} = require('../config.json');
const extConfig = require(`${destDir}/${extName}/extensions-config.json`);

const hasComponents = () => {
    return (
        extConfig.hasOwnProperty('components') &&
        extConfig.components.length > 0 &&
        extConfig.components[0] != ''
    );
}

const getComponentsNames = () => {
    if (hasComponents()){
        return extConfig.components;
    }
    return false;
}

const hasPackages = () => {
    return (
        extConfig.hasOwnProperty('package') &&
        extConfig.package != ''
    );
}

const getPackageName = () => {
    if(hasPackages()){
        return extConfig.package;
    }
    return false;
}

const hasPlugins = () => {
    if (extConfig.hasOwnProperty('plugins')) {
        var groups = extConfig.plugins;
        for (let group in groups) {
            if (
                extConfig.plugins[group].length > 0 &&
                extConfig.plugins[group][0] != ''
            ) {
                return true
            }
        }
    }
    return false;
}

const getPlugins = () => {
    if (hasPlugins()){
        return extConfig.plugins;
    }
    return false;
}

const hasModules = () => {
    if (extConfig.hasOwnProperty('modules')) {
        var clients = extConfig.modules;
        for (let client in clients) {
            if (
                extConfig.modules[client].length > 0 &&
                extConfig.modules[client][0] != ''
            ) {
                return true
            }
        }
    }
    return false;
}

const getModules = () => {
    if(hasModules()){
        return extConfig.modules;
    }
    return false;
}


module.exports = {
    hasComponents,
    getComponentsNames,
    hasPackages,
    getPackageName,
    hasPlugins,
    getPlugins,
    hasModules,
    getModules
}
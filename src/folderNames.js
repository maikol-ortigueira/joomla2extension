const config = require('../config.json');
const utils = require('./utils');
const capitalize = require('capitalize');

var components = utils.getComponentsNames();
var package = utils.getPackageName();
var plugins = utils.getPlugins();
var modules = utils.getModules();



var destRoot = `${config.destDir}/${config.extName}/extension`,
    releaseRoot = `${config.releaseDir}`,
    srcRoot = `${config.srcDir}`;

const getRelativePaths = (extensions) => {
    var paths = [];
    for (group in extensions) {
        for (plugin in extensions[group]) {
            paths.push(`${group}/${extensions[group][plugin]}`)
        }
    }
    return paths;
}

if (package) {
    // Package destiny
    destRoot = `${destRoot}/package/${package}`;

    // Package source
    srcPackage = [];
    srcPackage[package] = [];
    srcPackage[package]['manifest'] = `${srcRoot}/administrator/manifests/packages/pkg_${package}.xml`;
    srcPackage[package]['language'] = `${srcRoot}/language/**/*.pkg_${package}.*`;
}

// Set the components folders
if (components) {
    var componentsData = [];

    for (component in components) {
        let componentName = components[component]
        componentsData[componentName] = [];

        // Components destiny
        let dests = ['Admin', 'Site', 'Media']
        componentsData[componentName]['dest'] = [];
        componentsData[componentName]['clean'] = [];
        for (index in dests) {
            dest = dests[index].toLocaleLowerCase();
            componentsData[componentName]['dest'][`${dests[index]}`] = `${destRoot}/components/${componentName}/${dest}/`;
            componentsData[componentName]['clean'][`${dests[index]}`] = `${destRoot}/components/${componentName}/${dest}/`;
        }

        componentsData[componentName]['dest']['root'] = `${destRoot}/components/${componentName}/`;
        componentsData[componentName]['dest']['AdminLanguage'] = `${componentsData[componentName]['dest']['Admin']}/language/`;
        componentsData[componentName]['dest']['SiteLanguage'] = `${componentsData[componentName]['dest']['Site']}/language/`;
        componentsData[componentName]['dest']['Manifest'] = `${destRoot}/components/${componentName}/`;
        componentsData[componentName]['dest']['Release'] = `${releaseRoot}/components/${componentName}/`;

        // Components clear folders
        componentsData[componentName]['clean']['AdminLanguage'] = `${componentsData[componentName]['clean']['Admin']}/language/`;
        componentsData[componentName]['clean']['SiteLanguage'] = `${componentsData[componentName]['clean']['Site']}/language/`;
        componentsData[componentName]['clean']['Manifest'] = `${destRoot}/components/${componentName}/${componentName}.xml`;

        // Components source folders
        componentsData[componentName]['src'] = [];
        componentsData[componentName]['src']['Admin'] = [
            `${srcRoot}/administrator/components/com_${componentName}/**/*.*`,
            `!${srcRoot}/administrator/components/com_${componentName}/${componentName}.xml`
        ];
        componentsData[componentName]['src']['AdminLanguage'] = (`${srcRoot}/administrator/language/**/*.com_${componentName}.*`);
        componentsData[componentName]['src']['Site'] = (`${srcRoot}/components/com_${componentName}/**/*.*`);
        componentsData[componentName]['src']['SiteLanguage'] = (`${srcRoot}/language/**/*.com_${componentName}.*`);
        componentsData[componentName]['src']['Media'] = (`${srcRoot}/media/com_${componentName}/**/*.*`);
        componentsData[componentName]['src']['Manifest'] = `${srcRoot}/administrator/components/com_${componentName}/${componentName}.xml`;
    }

    exports.components = componentsData;
} else {
    exports.components = false;
}

if (plugins) {
    var pluginsData = [];
    let relativePaths = getRelativePaths(plugins);

    for (index in relativePaths) {
        let splitedPliginName = relativePaths[index].split('/'),
            pluginPath = relativePaths[index],
            pluginName = splitedPliginName[1],
            groupName = splitedPliginName[0],
            group_pluginName = `${groupName}_${pluginName}`,
            groupPluginNameCamelCase = capitalize(groupName) + capitalize(pluginName);

        pluginsData[groupPluginNameCamelCase] = [];
        pluginsData[groupPluginNameCamelCase]['dest'] = [];
        pluginsData[groupPluginNameCamelCase]['src'] = [];
        pluginsData[groupPluginNameCamelCase]['release'] = [];

        pluginsData[groupPluginNameCamelCase]['dest']['Content'] = (`${destRoot}/plugins/${pluginPath}/`);
        pluginsData[groupPluginNameCamelCase]['dest']['Language'] = (`${destRoot}/plugins/${pluginPath}/language/`);

        pluginsData[groupPluginNameCamelCase]['src']['Content'] = [
            `${srcRoot}/plugins/${pluginPath}/**/*.*`,
            `!${srcRoot}/plugins/${pluginPath}/language/**`,
        ];
        pluginsData[groupPluginNameCamelCase]['src']['Language'] = `${srcRoot}/administrator/language/**/*.plg_${group_pluginName}.*`;

        pluginsData[groupPluginNameCamelCase]['release']['extName'] = pluginName;
        pluginsData[groupPluginNameCamelCase]['release']['extGroup'] = groupName;
        pluginsData[groupPluginNameCamelCase]['release']['src'] = `${destRoot}/plugins/${pluginPath}/`;
        pluginsData[groupPluginNameCamelCase]['release']['dest'] = `${releaseRoot}/plugins/${pluginPath}/`;
    }

    exports.plugins = pluginsData;
} else {
    exports.plugins = false;
}

if (modules) {
    var modulesData = [];
    let relativePaths = getRelativePaths(modules);

    for (index in relativePaths) {
        let splitedModuleName = relativePaths[index].split('/'),
            moduleName = splitedModuleName[1],
            destModulePath = `${splitedModuleName[0]}/mod_${moduleName}`,
            srcModulePath = splitedModuleName[0] == 'admin' ? `administrator/modules/mod_${moduleName}` : `modules/mod_${moduleName}`,
            srcModuleLanguagePath = splitedModuleName[0] == 'admin' ? `administrator/language` : 'language',
            clientModuleNameCamelCase = capitalize(splitedModuleName[0]) + capitalize(moduleName);

        modulesData[clientModuleNameCamelCase] = [];
        modulesData[clientModuleNameCamelCase]['dest'] = [];
        modulesData[clientModuleNameCamelCase]['src'] = [];
        modulesData[clientModuleNameCamelCase]['release'] = [];

        modulesData[clientModuleNameCamelCase]['dest']['Content'] = `${destRoot}/modules/${destModulePath}/`;
        modulesData[clientModuleNameCamelCase]['dest']['Language'] = `${destRoot}/modules/${destModulePath}/language/`;

        modulesData[clientModuleNameCamelCase]['src']['Content'] = [`${srcRoot}/${srcModulePath}/**/*.*`, `!${srcRoot}/${srcModulePath}/language/**`];
        modulesData[clientModuleNameCamelCase]['src']['Language'] = `${srcRoot}/${srcModuleLanguagePath}/**/*.mod_${moduleName}.*`;
    }

    exports.modules = modulesData;
} else {
    exports.modules = false;
}
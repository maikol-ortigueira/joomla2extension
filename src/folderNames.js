const config = require('../config.json');
const utils = require('./utils');

var components = utils.getComponentsNames();
var package = utils.getPackageName();
var plugins = utils.getPlugins();
var modules = utils.getModules();



var destRoot = `${config.destDir}/${config.extName}/extension`,
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
        for (index in dests) {
            dest = dests[index].toLocaleLowerCase();
            componentsData[componentName]['dest'][`${dests[index]}`] = `${destRoot}/components/${componentName}/${dest}/`;
        }

        componentsData[componentName]['dest']['AdminLanguage'] = `${componentsData[componentName]['dest']['admin']}/language/`;
        componentsData[componentName]['dest']['SiteLanguage'] = `${componentsData[componentName]['dest']['site']}/language/`;
        componentsData[componentName]['dest']['Manifest'] = `${destRoot}/components/${componentName}/`;

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
    var destPlugins = [];
    var relativePaths = getRelativePaths(plugins)
    for (path in relativePaths) {
        destPlugins[path] = (`${destRoot}/plugins/${relativePaths[path]}`);
    }
}


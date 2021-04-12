const {
    extName,
    srcDir,
    destDir
} = require('../config.json');
var fs = require('fs'),
    xmlQuery = require('xml-query'),
    xmlReader = require('xml-reader');

const path = require('path');
const log = require('log-beautify');

var configPath = path.join(__dirname, '..');

if (extName == 'undefined' || extName == '') {
    console.error('\x1b[1m\x1b[33m=============================================================================================== ');
    console.error("\x1b[37m|\n|   \x1b[31m!Error en el fichero \x1b[37m\"config.json\"\x1b[31m!\x1b[37m\n|");
    console.error("|   Este fichero se encuentra en la carpeta:\n|");
    console.error("|\x1b[32m   " + configPath + "\n\x1b[37m|");
    console.error("|   Falta indicar el nombre de la extensión en la variable \x1b[34m\"extName\": \"\x1b[36mnombre_de_la_extension\x1b[34m\"\x1b[31m\n\x1b[37m|");
    console.error('\x1b[33m===============================================================================================\x1b[0m');

    return false;
}

if (!fs.existsSync(`${destDir}/${extName}/extensions-config.json`)) {
    console.error('\x1b[1m\x1b[33m=============================================================================================== ');
    console.error("\x1b[37m|\n|   \x1b[31m¡¡Error!!\x1b[37m   Falta el fichero de configuración de la extensión\n|");
    console.error("|   Debes crear un fichero con el nombre \"\x1b[32mextensions-config.json\x1b[37m\" en la siguiente carpeta:\n|")
    console.error("|   \x1b[32m" + `${destDir}/${extName}/`);
    console.error("\x1b[37m|\n|   Puedes copiar, pegar y sustituir los valores del fichero \"extension-config.json.dist\".");
    console.error("|   Deberás renombrarlo eliminando la extension \".dist\"\n|");
    console.error('\x1b[33m===============================================================================================\x1b[0m');
}
const extConfig = require(`${destDir}/${extName}/extensions-config.json`);


const hasComponents = () => {
    return (
        extConfig.hasOwnProperty('components') &&
        extConfig.components.length > 0 &&
        extConfig.components[0] != ''
    );
}

const getComponentsNames = () => {
    if (hasComponents()) {
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
    if (hasPackages()) {
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
    if (hasPlugins()) {
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
    if (hasModules()) {
        return extConfig.modules;
    }
    return false;
}

/**
 *
 * @param {string} element The element to retrieve
 * @param {string} file the file absolute path
 * @returns {string}
 */
const getXmlElement = (element, file) => {
    var xml = fs.readFileSync(file, 'utf-8');

    var ast = xmlReader.parseSync(xml);
    var xq = xmlQuery(ast);

    return xq.find(element).text();
}

module.exports = {
    hasComponents,
    getComponentsNames,
    hasPackages,
    getPackageName,
    hasPlugins,
    getPlugins,
    hasModules,
    getModules,
    getXmlElement
}
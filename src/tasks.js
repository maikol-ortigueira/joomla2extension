const Package = require('./Package');
const utils = require('./utils');

var cleanTasks = []
    copyTasks = [],
    backupTasks = [],
    releaseTasks = [],
    watchTasks = [];

if (utils.hasComponents()) {
    var componentsTasks = require('./components');

    // Add tasks to gulp main tasks
    cleanTasks.push('cleanComponents');
    copyTasks.push('copyComponents');
    backupTasks.push('backupComponents');
    releaseTasks.push('releaseComponents');
}

if (utils.hasLibraries()) {
    var librariesTasks = require('./libraries');

    // Add tasks to gulp main tasks
    cleanTasks.push('cleanLibraries');
    copyTasks.push('copyLibraries');
    backupTasks.push('backupLibraries');
    releaseTasks.push('releaseLibraries');
}

if (utils.hasPlugins()) {
    const pluginsTasks = require('./plugins');

    // Add tasks to gulp main tasks
    cleanTasks.push('cleanPlugins');
    copyTasks.push('copyPlugins');
    backupTasks.push('backupPlugins');
    releaseTasks.push('releasePlugins');
}

if (utils.hasModules()) {
    const modulesTasks = require('./modules');

    // Add tasks to gulp main tasks
    cleanTasks.push('cleanModules');
    copyTasks.push('copyModules');
    backupTasks.push('backupModules');
    releaseTasks.push('releaseModules');
}

if (utils.hasTemplates()) {
    const templateTasks = require('./templates')

    // Add tasks to gulp main tasks
    cleanTasks.push('cleanTemplates');
    copyTasks.push('copyTemplates');
    backupTasks.push('backupTemplates');
    releaseTasks.push('releaseTemplates');
}

if (utils.hasFiles()) {
    const filesTasks = require('./files');

    // Add tasks to gulp main tasks
    cleanTasks.push('cleanFiles');
    copyTasks.push('copyFiles');
    releaseTasks.push('releaseFiles');
}

if (utils.hasPackages()) {
    let pkg = new Package();
    cleanTasks.push(pkg.cleanTask);
    copyTasks.push(pkg.copyTask);
    releaseTasks.push(pkg.releaseTask);
}

exports.cleanTasks = cleanTasks;
exports.copyTasks = copyTasks;
exports.backupTasks = backupTasks;
exports.releaseTasks = releaseTasks;

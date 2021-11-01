const utils = require('./utils');
const gulp = require('gulp');

var cleanTasks = []
    copyTasks = [],
    releaseTasks = [],
    watchTasks = [];

var comp = utils.hasComponents();

if (utils.hasComponents()) {
    var componentsTasks = require('./components');

    // Add tasks to gulp main tasks
    cleanTasks.push('cleanComponents');
    copyTasks.push('copyComponents');
    releaseTasks.push('releaseComponents');
    watchTasks.push('watchComponents');
}

if (utils.hasPlugins()) {
    const pluginsTasks = require('./plugins');

    // Add tasks to gulp main tasks
    cleanTasks.push('cleanPlugins');
    copyTasks.push('copyPlugins');
    releaseTasks.push('releasePlugins');
    watchTasks.push('watchPlugins');
}

if (utils.hasModules()) {
    const modulesTasks = require('./modules');

    // Add tasks to gulp main tasks
    cleanTasks.push('cleanModules');
    copyTasks.push('copyModules');
    releaseTasks.push('releaseModules');
    watchTasks.push('watchModules');
}

exports.cleanTasks = cleanTasks;
exports.copyTasks = copyTasks;
exports.releaseTasks = releaseTasks;
exports.watchTasks = watchTasks;
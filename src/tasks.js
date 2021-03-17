const utils = require('./utils');
const gulp = require('gulp');

var cleanTasks = []
    copyTasks = [],
    watchTasks = [];

if (utils.hasComponents) {
    var componentsTasks = require('./components');

    // Add tasks to gulp main tasks
    cleanTasks.push('cleanComponents');
    copyTasks.push('copyComponents');
    watchTasks.push('watchComponents');
}

if (utils.hasPlugins) {
    const pluginsTasks = require('./plugins');

    // Add tasks to gulp main tasks
    cleanTasks.push('cleanPlugins');
    copyTasks.push('copyPlugins');
    watchTasks.push('watchPlugins');
}

exports.cleanTasks = cleanTasks;
exports.copyTasks = copyTasks;
exports.watchTasks = watchTasks;
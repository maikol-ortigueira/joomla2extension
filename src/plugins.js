const { task, parallel } = require("gulp");
const { hasPlugins, getPlugins } = require("./utils");
const Plugin = require('./Plugin');

if (hasPlugins) {
    const groups = getPlugins();

    let cleanPlugins = [], copyPlugins = [], backupPlugins = [], releasePlugins = [];

    for (let type in groups) {
        groups[type].forEach(name => {
            let plugin = new Plugin(name, type)

            cleanPlugins.push(plugin.cleanTask)
            copyPlugins.push(plugin.copyTask)
            backupPlugins.push(plugin.backupTask)
            releasePlugins.push(plugin.releaseTask)
        })
    }

    task(`cleanPlugins`, parallel(...cleanPlugins));
    task(`copyPlugins`, parallel(...copyPlugins));
    task(`backupPlugins`, parallel(...backupPlugins));
    task(`releasePlugins`, parallel(...releasePlugins));
}
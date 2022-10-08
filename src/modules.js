const { task, parallel } = require("gulp");
const Modulo = require("./Modulo");
const { hasModules, getModules } = require("./utils");

if (hasModules) {
    const clients = getModules();
    let cleanModules = [], copyModules = [], backupModules = [], releaseModules = []

    for (let client in clients) {
        clients[client].forEach(name => {
            let module = new Modulo(name, client)

            cleanModules.push(module.cleanTask)
            copyModules.push(module.copyTask)
            backupModules.push(module.backupTask)
            releaseModules.push(module.releaseTask)
        })
    }

    task(`cleanModules`, parallel(...cleanModules));
    task(`copyModules`, parallel(...copyModules));
    task(`backupModules`, parallel(...backupModules));
    task(`releaseModules`, parallel(...releaseModules));    
}
const Template = require("./Template");
const { getTemplates } = require("./utils");
const { task, parallel } = require("gulp");

if (getTemplates !== false) {
    const templates = getTemplates();
    let cleanTemplates = [], copyTemplates = [], backupTemplates = [], releaseTemplates = [];

    for (let client in templates) {
        templates[client].forEach(name => {
            let temp = new Template(name, client)

            cleanTemplates.push(temp.cleanTask)
            copyTemplates.push(temp.copyTask)
            backupTemplates.push(temp.backupTask)
            releaseTemplates.push(temp.releaseTask)
        })
    }

    task(`cleanTemplates`, parallel(...cleanTemplates));
    task(`copyTemplates`, parallel(...copyTemplates));
    task(`backupTemplates`, parallel(...backupTemplates));
    task(`releaseTemplates`, parallel(...releaseTemplates));
}
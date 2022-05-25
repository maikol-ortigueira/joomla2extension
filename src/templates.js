const Template = require("./Template");
const { hasTemplates, getTemplatesName } = require("./utils");
const { task, parallel } = require("gulp");

if (hasTemplates) {
    const templates = getTemplatesName();
    let cleanTemplates = [], copyTemplates = [], releaseTemplates = [];

    templates.forEach(template => {

        let tmpl = new Template(template, 'site');

        cleanTemplates.push(tmpl.cleanTask);
        copyTemplates.push(tmpl.copyTask);
        releaseTemplates.push(tmpl.releaseTask);
    });

    task(`cleanTemplates`, parallel(...cleanTemplates));
    task(`copyTemplates`, parallel(...copyTemplates));
    task(`releaseTemplates`, parallel(...releaseTemplates));
}
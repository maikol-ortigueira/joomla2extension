const { task, parallel } = require("gulp");
const Component = require("./Component");
const { hasComponents, getComponentsNames } = require("./utils");

if (hasComponents) {
    const components = getComponentsNames();
    let cleanComponents = [], copyComponents = [], backupComponents = [], releaseComponents = [];

    components.forEach(name => {
        let component = new Component(name);

        cleanComponents.push(component.cleanTask);
        copyComponents.push(component.copyTask);
        backupComponents.push(component.backupTask);
        releaseComponents.push(component.releaseTask);
    });

    task(`cleanComponents`, parallel(...cleanComponents));
    task(`copyComponents`, parallel(...copyComponents));
    task(`backupComponents`, parallel(...backupComponents));
    task(`releaseComponents`, parallel(...releaseComponents));
}
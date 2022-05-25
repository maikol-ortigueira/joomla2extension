const { task, parallel } = require("gulp");
const Component = require("./Component");
const { hasComponents, getComponentsNames } = require("./utils");

if (hasComponents) {
    const components = getComponentsNames();
    let cleanComponents = [], copyComponents = [], releaseComponents = [];

    components.forEach(name => {
        let component = new Component(name);

        cleanComponents.push(component.cleanTask);
        copyComponents.push(component.copyTask);
        releaseComponents.push(component.releaseTask);
    });

    task(`cleanComponents`, parallel(...cleanComponents));
    task(`copyComponents`, parallel(...copyComponents));
    task(`releaseComponents`, parallel(...releaseComponents));
}
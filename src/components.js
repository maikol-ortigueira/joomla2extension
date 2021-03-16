const gulp = require('gulp');
const capitalize = require('capitalize');
const { components } = require('./folderNames');
const debug = require('gulp-debug');

for (component in components) {
    let cExtName = capitalize(component),
        folders = components[component],
        srcPaths = folders['src'],
        destPaths = folders['dest'],
        types = ['Admin','Site','Media'],
        copyComponent = [];

    for (index in types){
        copyComponent[index] = `copyComponent${cExtName}${types[index]}`;
    }

    gulp.task(`copyComponent${cExtName}Admin`, function (cb) {
        return gulp.src([srcPaths['admin']])
            .pipe(debug({title: 'unicorn:'}))
            .pipe(gulp.dest(destPaths['admin']));
        cb();
    });

    gulp.task(`copyComponent${cExtName}`, function (cb) {
        gulp.parallel(...copyComponent)
        console.log("Enviado desde la tarea copyComponent" + cExtName);
        cb();
    });
}

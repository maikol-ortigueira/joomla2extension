const gulp = require('gulp');
const capitalize = require('capitalize');
const { components } = require('./folderNames');
const clean = require('gulp-clean');
const debug = require('gulp-debug');

const copyComponents = [],
    cleanComponents = [],
    watchComponents = [];

for (component in components) {
    let cExtName = capitalize(component),
        folders = components[component],
        srcPaths = folders['src'],
        destPaths = folders['dest'],
        types = ['Admin', 'Site', 'Media', 'Manifest', 'AdminLanguage', 'SiteLanguage'],
        copyComponentExtName = [],
        cleanComponentExtName = [],
        watchComponentExtName = [];

    copyComponents.push(`copyComponent${cExtName}`);
    cleanComponents.push(`cleanComponent${cExtName}`);
    watchComponents.push(`watchComponent${cExtName}`);

    for (index in types) {
        copyComponentExtName[index] = `copyComponent${cExtName}${types[index]}`;
        cleanComponentExtName[index] = `cleanComponent${cExtName}${types[index]}`;
        watchComponentExtName[index] = `watchComponent${cExtName}${types[index]}`;

        destiny = types[index].toLocaleLowerCase();
        cleanPath = destPaths[`${types[index]}`] + '**/*.*';

        // clean tasks
        gulp.task(`cleanComponent${cExtName}${types[index]}`, function (cb) {
            return gulp.src([cleanPath])
                .pipe(debug());
            cb();
        });

        // Copy tasks
        gulp.task(`copyComponent${cExtName}${types[index]}`, function (cb) {
            return gulp.src(srcPaths[`${types[index]}`])
                .pipe(gulp.dest(destPaths[`${types[index]}`]))
            cb();
        });


    }

    gulp.task(`cleanComponent${cExtName}`,
        gulp.parallel(...cleanComponentExtName)
    );

    gulp.task(`copyComponent${cExtName}`,
        gulp.parallel(...copyComponentExtName)
    );

}

gulp.task(`cleanComponents`, gulp.parallel(...cleanComponents));
gulp.task(`copyComponents`, gulp.parallel(...copyComponents));
//gulp.task(`watchComponents`, gulp.parallel(...watchComponents));

const gulp = require('gulp');
const capitalize = require('capitalize');
const {
    components
} = require('./folderNames');
const clean = require('gulp-clean');

const copyComponents = [],
    cleanComponents = [],
    watchComponents = [];

for (component in components) {
    let cExtName = capitalize(component),
        folders = components[component],
        srcPaths = folders['src'],
        destPaths = folders['dest'],
        cleanPaths = folders['clean'],
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

        // clean tasks

        gulp.task(`cleanComponent${cExtName}Admin`, function (cb) {
            return gulp.src(cleanPaths[`Admin`], {
                    read: false,
                    allowEmpty: true
                })
                .pipe(clean({
                    force: true
                }));
            cb();
        });


        gulp.task(`cleanComponent${cExtName}Site`, function (cb) {
            return gulp.src(cleanPaths[`Site`], {
                    read: false,
                    allowEmpty: true
                })
                .pipe(clean({
                    force: true
                }));
            cb();
        });


        gulp.task(`cleanComponent${cExtName}Media`, function (cb) {
            return gulp.src(cleanPaths[`Media`], {
                    read: false,
                    allowEmpty: true
                })
                .pipe(clean({
                    force: true
                }));
            cb();
        });


        gulp.task(`cleanComponent${cExtName}Manifest`, function (cb) {
            return gulp.src(cleanPaths[`Manifest`], {
                    read: false,
                    allowEmpty: true
                })
                .pipe(clean({
                    force: true
                }));
            cb();
        });


        gulp.task(`cleanComponent${cExtName}AdminLanguage`, function (cb) {
            return gulp.src(cleanPaths[`AdminLanguage`], {
                    read: false,
                    allowEmpty: true
                })
                .pipe(clean({
                    force: true
                }));
            cb();
        });


        gulp.task(`cleanComponent${cExtName}SiteLanguage`, function (cb) {
            return gulp.src(cleanPaths[`SiteLanguage`], {
                    read: false,
                    allowEmpty: true
                })
                .pipe(clean({
                    force: true
                }));
            cb();
        });

        // Copy tasks

        gulp.task(`copyComponent${cExtName}Admin`, gulp.series(`cleanComponent${cExtName}Admin`, function (cb) {
            return gulp.src(srcPaths['Admin'], {
                    allowEmpty: true
                })
                .pipe(gulp.dest(destPaths['Admin']))
            cb();
        }));

        gulp.task(`copyComponent${cExtName}Site`, gulp.series(`cleanComponent${cExtName}Site`, function (cb) {
            return gulp.src(srcPaths['Site'], {
                    allowEmpty: true
                })
                .pipe(gulp.dest(destPaths['Site']))
            cb();
        }));

        gulp.task(`copyComponent${cExtName}Media`, gulp.series(`cleanComponent${cExtName}Media`, function (cb) {
            return gulp.src(srcPaths['Media'], {
                    allowEmpty: true
                })
                .pipe(gulp.dest(destPaths['Media']))
            cb();
        }));

        gulp.task(`copyComponent${cExtName}Manifest`, gulp.series(`cleanComponent${cExtName}Manifest`, function (cb) {
            return gulp.src(srcPaths['Manifest'], {
                    allowEmpty: true
                })
                .pipe(gulp.dest(destPaths['Manifest']))
            cb();
        }));

        gulp.task(`copyComponent${cExtName}AdminLanguage`, gulp.series(`cleanComponent${cExtName}AdminLanguage`, function (cb) {
            return gulp.src(srcPaths['AdminLanguage'], {
                    allowEmpty: true
                })
                .pipe(gulp.dest(destPaths['AdminLanguage']))
            cb();
        }));

        gulp.task(`copyComponent${cExtName}SiteLanguage`, gulp.series(`cleanComponent${cExtName}SiteLanguage`, function (cb) {
            return gulp.src(srcPaths['SiteLanguage'], {
                    allowEmpty: true
                })
                .pipe(gulp.dest(destPaths['SiteLanguage']))
            cb();
        }));


        // Watch tasks
        gulp.task(`watchComponent${cExtName}Admin`, function (cb) {
            return gulp.watch(srcPaths['Admin'], gulp.series(`copyComponent${cExtName}Admin`))
        });

        gulp.task(`watchComponent${cExtName}Site`, function (cb) {
            return gulp.watch(srcPaths['Site'], gulp.series(`copyComponent${cExtName}Site`))
        });

        gulp.task(`watchComponent${cExtName}Media`, function (cb) {
            return gulp.watch(srcPaths['Media'], gulp.series(`copyComponent${cExtName}Media`))
        });

        gulp.task(`watchComponent${cExtName}Manifest`, function (cb) {
            return gulp.watch(srcPaths['Manifest'], gulp.series(`copyComponent${cExtName}Manifest`))
        });

        gulp.task(`watchComponent${cExtName}AdminLanguage`, function (cb) {
            return gulp.watch(srcPaths['AdminLanguage'], gulp.series(`copyComponent${cExtName}AdminLanguage`))
        });

        gulp.task(`watchComponent${cExtName}SiteLanguage`, function (cb) {
            return gulp.watch(srcPaths['SiteLanguage'], gulp.series(`copyComponent${cExtName}SiteLanguage`))
        });

    }

    gulp.task(`cleanComponent${cExtName}`,
        gulp.parallel(...cleanComponentExtName)
    );

    gulp.task(`copyComponent${cExtName}`,
        gulp.parallel(...copyComponentExtName)
    );

    gulp.task(`watchComponent${cExtName}`,
        gulp.parallel(...watchComponentExtName)
    );

}

gulp.task(`cleanComponents`, gulp.series(...cleanComponents));
gulp.task(`copyComponents`, gulp.series(...copyComponents));
gulp.task(`watchComponents`, gulp.parallel(...watchComponents));
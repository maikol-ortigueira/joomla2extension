const { modules } = require('./folderNames');

if (modules) {
    const GulpZip = require('gulp-zip');
    const gulp = require('gulp');
    const clean = require('gulp-clean');
    const utils = require('./utils');
    const fs = require('fs');

    const cleanModules = [],
        copyModules = [],
        watchModules = [],
        releaseModules = [];

    for (module in modules) {
        let cleanModuleExtName = [],
            copyModuleExtName = [],
            watchModuleExtName = [],
            releaseModuleExtName = [],
            srcPaths = modules[module]['src'],
            destPaths = modules[module]['dest'],
            releasePaths = modules[module]['release'],
            moduleTasks = ['Content', 'Language'],
            moduleMainTask = `Module${module}`;

        cleanModules.push(`cleanModule${module}`);
        copyModules.push(`copyModule${module}`);
        watchModules.push(`watchModule${module}`);
        releaseModules.push(`releaseModule${module}`);

        for (index in moduleTasks) {
            let taskName = `${moduleMainTask}${moduleTasks[index]}`;

            cleanModuleExtName[index] = `clean${taskName}`;
            copyModuleExtName[index] = `copy${taskName}`;
            watchModuleExtName[index] = `watch${taskName}`;
            releaseModuleExtName[index] = `release${taskName}`;
        }

        // clean tasks
        gulp.task(`clean${moduleMainTask}Content`, function (cb) {
            return gulp.src(destPaths['Content'], {read: false, allowEmpty: true })
                .pipe(clean({ force: true }));
                cb();
        });

        gulp.task(`clean${moduleMainTask}Language`, function (cb) {
            return gulp.src(destPaths['Language'], {read: false, allowEmpty: true })
                .pipe(clean({ force: true }));
                cb();
        });

        // copy tasks
        gulp.task(`copy${moduleMainTask}Content`,
            gulp.series(`clean${moduleMainTask}Content`,
                function (cb) {
                    return gulp.src(srcPaths['Content'], { allowEmpty: true } )
                        .pipe(gulp.dest(destPaths['Content']));
                    cb();
                }
            )
        );

        gulp.task(`copy${moduleMainTask}Language`,
            gulp.series(`clean${moduleMainTask}Language`,
                function (cb) {
                    return gulp.src(srcPaths['Language'], { allowEmpty: true } )
                        .pipe(gulp.dest(destPaths['Language']));
                    cb();
                }
            )
        );

        // watch tasks
        gulp.task(`watch${moduleMainTask}Content`,
            function (cb) {
                return gulp.watch(srcPaths['Content'], gulp.series(`copy${moduleMainTask}Content`))
            }
        );

        gulp.task(`watch${moduleMainTask}Language`,
            function (cb) {
                return gulp.watch(srcPaths['Language'], gulp.series(`copy${moduleMainTask}Language`))
            }
        );

        // Module Main tasks
        gulp.task(`clean${moduleMainTask}`,
            gulp.series(...cleanModuleExtName)
        );

        gulp.task(`copy${moduleMainTask}`,
            gulp.series(...copyModuleExtName)
        );

        gulp.task(`watch${moduleMainTask}`,
            gulp.parallel(...watchModuleExtName)
        );

        // Module release
        let manifestPath = `${releasePaths['src']}mod_${releasePaths['extName']}.xml`;

        if(fs.existsSync(manifestPath))
        {
            // If manifest file exists means that we can release
            moduleVersion = utils.getXmlElement('version', manifestPath);
        }
            
            gulp.task(`release${moduleMainTask}`, function() {
                return gulp.src(`${releasePaths['src']}/**`)
                .pipe(GulpZip(`mod_${releasePaths['extName']}.v${moduleVersion}.zip`))
                .pipe(gulp.dest(releasePaths['dest']));
            })
    }

    // Modules Main Tasks
    gulp.task(`cleanModules`, gulp.parallel(...cleanModules));
    gulp.task(`copyModules`, gulp.parallel(...copyModules));
    gulp.task(`watchModules`, gulp.parallel(...watchModules));
    gulp.task(`releaseModules`, gulp.parallel(...releaseModules));


}
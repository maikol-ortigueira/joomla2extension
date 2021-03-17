const {
    plugins
} = require('./folderNames');

if (plugins) {
    const gulp = require('gulp');
    const clean = require('gulp-clean');

    const cleanPlugins = [],
        copyPlugins = [],
        watchPlugins = [];

    for (plugin in plugins) {
        let cleanPluginExtName = [],
            copyPluginExtName = [],
            watchPluginExtName = [],
            srcPaths = plugins[plugin]['src'],
            destPaths = plugins[plugin]['dest'],
            pluginsTasks = ['Content', 'Language'],
            pluginMainTask = `Plugin${plugin}`;

        cleanPlugins.push(`cleanPlugin${plugin}`);
        copyPlugins.push(`copyPlugin${plugin}`);
        watchPlugins.push(`watchPlugin${plugin}`);

        for (index in pluginsTasks) {
            let taskName = `${pluginMainTask}${pluginsTasks[index]}`;

            cleanPluginExtName[index] = `clean${taskName}`;
            copyPluginExtName[index] = `copy${taskName}`;
            watchPluginExtName[index] = `watch${taskName}`;
        }

        // clean tasks
        gulp.task(`clean${pluginMainTask}Content`, function (cb) {
            return gulp.src(destPaths['Content'], {read: false, allowEmpty: true })
                .pipe(clean({ force: true }));
                cb();
        });

        gulp.task(`clean${pluginMainTask}Language`, function (cb) {
            return gulp.src(destPaths['Language'], {read: false, allowEmpty: true })
                .pipe(clean({ force: true }));
                cb();
        });

        // copy tasks
        gulp.task(`copy${pluginMainTask}Content`,
            gulp.series(`clean${pluginMainTask}Content`,
                function (cb) {
                    return gulp.src(srcPaths['Content'], { allowEmpty: true } )
                        .pipe(gulp.dest(destPaths['Content']));
                    cb();
                }
            )
        );

        gulp.task(`copy${pluginMainTask}Language`,
            gulp.series(`clean${pluginMainTask}Language`,
                function (cb) {
                    return gulp.src(srcPaths['Language'], { allowEmpty: true } )
                        .pipe(gulp.dest(destPaths['Language']));
                    cb();
                }
            )
        );

        // watch tasks
        gulp.task(`watch${pluginMainTask}Content`,
            function (cb) {
                return gulp.watch(srcPaths['Content'], gulp.series(`copy${pluginMainTask}Content`))
            }
        );

        gulp.task(`watch${pluginMainTask}Language`,
            function (cb) {
                return gulp.watch(srcPaths['Language'], gulp.series(`copy${pluginMainTask}Language`))
            }
        );

        // Plugin Main tasks
        gulp.task(`clean${pluginMainTask}`,
            gulp.parallel(...cleanPluginExtName)
        );

        gulp.task(`copy${pluginMainTask}`,
            gulp.parallel(...copyPluginExtName)
        );

        gulp.task(`watch${pluginMainTask}`,
            gulp.parallel(...watchPluginExtName)
        );
    }

    // Plugins Main Tasks
    gulp.task(`cleanPlugins`, gulp.series(...cleanPlugins));
    gulp.task(`copyPlugins`, gulp.series(...copyPlugins));
    gulp.task(`watchPlugins`, gulp.series(...watchPlugins));
}
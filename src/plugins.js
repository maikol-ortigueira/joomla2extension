const {
    plugins
} = require('./folderNames');

if (plugins) {
    const GulpZip = require('gulp-zip');
    const gulp = require('gulp');
    const clean = require('gulp-clean');
    const utils = require('./utils');
    const fs = require('fs');

    const cleanPlugins = [],
        copyPlugins = [],
        watchPlugins = [],
        releasePlugins = [];

    for (plugin in plugins) {
        let cleanPluginExtName = [],
            copyPluginExtName = [],
            watchPluginExtName = [],
            releasePluginExtName = [],
            srcPaths = plugins[plugin]['src'],
            destPaths = plugins[plugin]['dest'],
            releasePaths = plugins[plugin]['release'],
            pluginsTasks = ['Content', 'Language'],
            pluginMainTask = `Plugin${plugin}`;

        cleanPlugins.push(`cleanPlugin${plugin}`);
        copyPlugins.push(`copyPlugin${plugin}`);
        watchPlugins.push(`watchPlugin${plugin}`);
        releasePlugins.push(`releasePlugin${plugin}`);

        for (index in pluginsTasks) {
            let taskName = `${pluginMainTask}${pluginsTasks[index]}`;

            cleanPluginExtName[index] = `clean${taskName}`;
            copyPluginExtName[index] = `copy${taskName}`;
            watchPluginExtName[index] = `watch${taskName}`;
            releasePluginExtName[index] = `release${taskName}`;
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
            gulp.series(...cleanPluginExtName)
        );

        gulp.task(`copy${pluginMainTask}`,
            gulp.series(...copyPluginExtName)
        );

        gulp.task(`watch${pluginMainTask}`,
            gulp.parallel(...watchPluginExtName)
        );

        // Plugin release
        let manifestPath = `${releasePaths['src']}${releasePaths['extName']}.xml`;

        if (fs.existsSync(manifestPath))
            pluginVersion = utils.getXmlElement('version', manifestPath);

        gulp.task(`release${pluginMainTask}`, function () {
            return gulp.src(`${releasePaths['src']}/**`)
                .pipe(GulpZip(`plg_${releasePaths['extGroup']}_${releasePaths['extName']}.v${pluginVersion}.zip`))
                .pipe(gulp.dest(releasePaths['dest']));
        });
    }

    // Plugins Main Tasks
    gulp.task(`cleanPlugins`, gulp.parallel(...cleanPlugins));
    gulp.task(`copyPlugins`, gulp.parallel(...copyPlugins));
    gulp.task(`watchPlugins`, gulp.parallel(...watchPlugins));
    gulp.task(`releasePlugins`, gulp.parallel(...releasePlugins));
}
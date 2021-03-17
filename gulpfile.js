const tareas = require('./src/tasks');
const gulp = require('gulp');

gulp.task('clean', gulp.series(...tareas.cleanTasks));
gulp.task('copy', gulp.series(...tareas.copyTasks));
gulp.task('watch', gulp.parallel(...tareas.watchTasks));

gulp.task('default', gulp.series('clean', 'copy', 'watch'));

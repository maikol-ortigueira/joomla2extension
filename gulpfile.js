    const tareas = require('./src/tasks');
    const {task, series} = require('gulp')

    task('clean', series(...tareas.cleanTasks));
    task('copy', series(...tareas.copyTasks));
    task('release', series(...tareas.releaseTasks));

    task('default', series('clean', 'copy', 'release'));

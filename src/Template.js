const Manifest = require("./Manifest");
const { limpiarRuta, getManisfestFiles, getManisfestFolders, getManifestLanguages } = require("./utils");
const { destDir, srcDir, releaseDir, backupDir } = require('../config.json');
const capitalize = require("capitalize");
const { task, src, dest, series } = require("gulp");
const clean = require('gulp-clean');
const gulpForeach = require("gulp-foreach");
const GulpZip = require("gulp-zip");

class Template {
    
    constructor(nombre, cliente = 'site') {
        let ruta = limpiarRuta(srcDir);
        this.rutaDesde = ruta;
        nombre = nombre.toLowerCase();
        this.nombre = nombre;
        this.cNombre = capitalize(nombre);
        cliente = cliente.toLowerCase() == 'site' ? '' : 'administrator';
        this.cliente = cliente;
        cliente = cliente == 'administrator' ? cliente + '/' : '';
        this.rutaCompleta = ruta + cliente + 'templates/' + nombre + '/';

        let manifest = new Manifest(ruta, 'template', nombre, cliente);
        this.manifiesto = manifest.manifiesto;

        this.copyTemplate = [];

        let destinoRelease = releaseDir.charAt(releaseDir.length - 1) == '/' ? releaseDir : releaseDir + '/';
        this.releaseDest = destinoRelease + 'templates/' + this.nombre + '/';

        this.srcPathsArray = this.rutaCompletaDesde.replace(/^\/+|\/+$/g, '').split('/').length;
        this.srcMediaPathArray = this.rutaMediaDesde.replace(/^\/+|\/+$/g, '').split('/').length;

    }

    get rutaCompletaDesde() {
        return this.rutaCompleta;
    }

    get rutaMediaDesde() {
        let cliente = this.cliente === '' ? 'site/' : 'administrator/';
        return this.rutaDesde + 'media/templates/' + cliente + this.nombre + '/';
    }

    get rutaLanguagesDesde() {
        let cliente = this.cliente === '' ? this.cliente : 'administrator/';
        return this.rutaDesde + cliente + 'language/';
    }

    get version() {
        return this.manifiesto.version;
    }

    get files() {
        if (this.hasFiles) {
            return getManisfestFiles(this.manifiesto.files, this.rutaCompletaDesde);
        }
    }

    get folders() {
        if (this.hasFiles) {
            return getManisfestFolders(this.manifiesto.files, this.rutaCompletaDesde);
        }
    }

    get mediaFiles() {
        if (this.hasMedia) {
            return getManisfestFiles(this.manifiesto.media, this.rutaMediaDesde)
        }
    }

    get mediaFolders() {
        if (this.hasMedia) {
            return getManisfestFolders(this.manifiesto.media, this.rutaMediaDesde);
        }
    }

    get languagesFiles() {
        return getManifestLanguages(this.manifiesto.languages, this.rutaLanguagesDesde);
    }

    get destino() {
        destDir.charAt(destDir.length - 1) == '/' ? destDir : destDir + '/';
        return `${destDir}/templates/${this.nombre}/`;
    }

    get destBackup() {
        backupDir.charAt(backupDir.length - 1) == '/' ? backupDir : backupDir + '/';
        let cliente = this.cliente === 'admin' ? this.cliente : 'site';
        return `${backupDir}/templates/${cliente}/${this.nombre}/`;
    }

    get zipFileName() {
        return `tpl_${this.nombre}.v${this.version}.zip`;
    }

    hasMedia() {
        return manifest.hasMedia;
    }

    hasLanguage() {
        return this.manifiesto.languages !== undefined;
    }

    hasFiles() {
        return this.manifiesto.files !== undefined;
    }

    // clean tasks
    get cleanTask() {
        let destino = this.destino;

        task(`cleanTemplate${this.cNombre}`, function (cb) {
            return src(destino, {
                read: false,
                allowEmpty: true
            })
                .pipe(clean({ force: true }));
            cb();
        });

        return `cleanTemplate${this.cNombre}`;
    }

    get copyTask() {
        this.copyFilesTask;
        this.copyFoldersTask;
        this.copyMediaFilesTask;
        this.copyMediaFoldersTask;
        this.copyLanguagesTask;

        task(`copyTemplate${this.cNombre}`, series(...this.copyTemplate));

        return `copyTemplate${this.cNombre}`;
    }

    get cleanBackupTask() {
        let destino = this.destBackup + this.cliente
        task(`cleanTemplateBackup${this.cNombre}`, function (cb) {
            return src(destino, {
                read: false,
                allowEmpty: true
            })
                .pipe(clean({ force: true }));
            cb();
        });

        return `cleanTemplateBackup${this.cNombre}`;

    }

    get backupTask() {
        this.cleanBackupTask;
        
        let origen = this.destino + '**/*.*'
        let destino = this.destBackup + this.cliente;

        task (`backupTemplate${this.cNombre}`, series(`cleanTemplateBackup${this.cNombre}`, () => {
            return src(origen, { allowEmpty:true })
                .pipe(dest(destino))
        }))

        return `backupTemplate${this.cNombre}`;
    }

    get releaseTask() {
        let desde = this.destino + '/**';
        let destino = this.releaseDest;
        let filename = this.zipFileName;

        task(`releaseTemplate${this.cNombre}`, function(cb) {
            return src(desde)
                .pipe(GulpZip(filename))
                .pipe(dest(destino))
        })

        return `releaseTemplate${this.cNombre}`;
    }

    // copy files task
    get copyFilesTask() {
        let files = this.files;
        let destino = this.destino;

        if (files.length > 0) {
            task(`copyTemplateFiles${this.cNombre}`, function (cb) {
                return src(files, { allowEmpty: true })
                    .pipe(dest(destino))
            })
            this.copyTemplate.push(`copyTemplateFiles${this.cNombre}`);
        }
    }

    // copy folders task
    get copyFoldersTask() {
        let folders = this.folders;
        let destino = this.destino;
        let srcPathsArrayLong = this.srcPathsArray

        if (folders.length > 0) {
            task(`copyTemplateFolders${this.cNombre}`, function (cb) {
                return src(folders, { allowEmpty: true })
                .pipe(gulpForeach(function (stream, file) {
                    let destinoF = destino + file.path.replace(/^\/+|\/+$/g, '').split('/')[srcPathsArrayLong] + '/'
                    return stream
                    .pipe(dest(destinoF))
                }))
            })
            this.copyTemplate.push(`copyTemplateFolders${this.cNombre}`);
        }
    }

    // copy media files task
    get copyMediaFilesTask() {
        let mediaFiles = this.mediaFiles;
        let destino = this.destino;

        if (mediaFiles.length > 0) {
            task(`copyTemplateMediaFiles${this.cNombre}`, function (cb) {
                return src(mediaFiles, { allowEmpty: true })
                    .pipe(dest(destino + 'media/'))
            })
            this.copyTemplate.push(`copyTemplateMediaFiles${this.cNombre}`);
        }
    }

    // copy media folders task
    get copyMediaFoldersTask() {
        let mediaFolders = this.mediaFolders;
        let destino = this.destino;
        let srcMediaPathArray = this.srcMediaPathArray

        if (mediaFolders.length > 0) {
            task(`copyTemplateMediaFolders${this.cNombre}`, function (cb) {
                return src(mediaFolders, { allowEmpty: true })
                .pipe(gulpForeach(function (stream, file) {
                    let mediaDestino = destino + '/media/' + file.path.replace(/^\/+|\/+$/g, '').split('/')[srcMediaPathArray];
                    return stream
                    .pipe(dest(mediaDestino))
                }))
            })
            this.copyTemplate.push(`copyTemplateMediaFolders${this.cNombre}`);
        }
    }

    // copy languages task
    get copyLanguagesTask() {
        let languages = this.languagesFiles;
        let folder = this.manifiesto.languages[0].$.folder;
        let destino  = this.destino;

        if (languages.length > 0) {
            task(`copyTemplateLanguagesFiles${this.cNombre}`, function (cb) {
                return src(languages, { allowEmpty: true })
                .pipe(gulpForeach(function (stream, file) {
                    let pathArray = file.path.split('/');
                    let longPathArray = pathArray.length;
                    let idioma = pathArray[longPathArray - 2];
                    return stream
                    .pipe(dest(destino + folder + '/' + idioma + '/'))
                }))
            });

            this.copyTemplate.push(`copyTemplateLanguagesFiles${this.cNombre}`);
        }
    }

}

module.exports = Template;
const { task, series, src, dest } = require('gulp')
const { srcDir, destDir, releaseDir } = require('../config.json')
const Manifest = require('./Manifest')
const { limpiarRuta, getManisfestFiles, getManisfestFolders, getManifestLanguages } = require('./utils')
const capitalize = require('capitalize')
const gulpClean = require('gulp-clean')
const gulpForeach = require('gulp-foreach')
const GulpZip = require('gulp-zip')

class Plugin {

    constructor(nombre, grupo) {
        let ruta = limpiarRuta(srcDir)
        this.rutaDesde = ruta
        nombre = nombre.toLowerCase()
        this.nombre = nombre
        grupo = grupo.toLowerCase()
        this.grupo = grupo
        this.cNombre = capitalize(nombre)

        let manifest = new Manifest(ruta, 'plugin', nombre, grupo)
        this.manifiesto = manifest.manifiesto;
        this.version = this.manifiesto.version

        let group = this.manifiesto.$.group
        this.group = group
        this.rutaCompletaDesde = `${ruta}plugins/${group}/${nombre}/`
        this.rutaLanguagesDesde = `${ruta}administrator/language/`

        this.copyPlugin = [];

        let destino = destDir.charAt(destDir.length - 1) == '/' ? destDir : destDir + '/';
        this.destino = `${destino}plugins/${group}/${this.nombre}/`;

        if (this.manifiesto.languages[0] !== undefined) {
            let folder = this.manifiesto.languages[0].language[0]['_'].split('/')[0];
            this.languageFolder = folder
            this.languageDestino = `${this.destino}${folder}/`
        }

        let destinoRelease = releaseDir.charAt(releaseDir.length - 1) == '/' ? releaseDir : releaseDir + '/';
        this.releaseDest = `${destinoRelease}plugins/${group}/${this.nombre}/`

        this.srcPathArrayLong = this.rutaCompletaDesde.replace(/^\/+|\/+$/g, '').split('/').length;
    }

    get files() {
        return getManisfestFiles(this.manifiesto.files, this.rutaCompletaDesde);
    }

    get folders() {
        return getManisfestFolders(this.manifiesto.files, this.rutaCompletaDesde)
    }

    get languages() {
        return getManifestLanguages(this.manifiesto.languages, this.rutaLanguagesDesde, this.languageFolder)
    }

    get manifestFile() {
        return `${this.rutaCompletaDesde + this.nombre}.xml`
    }

    get zipFileName() {
        return `plg_${this.group}_${this.nombre}.v${this.version}.zip`
    }

    // Tasks
    // clean Task
    get cleanTask() {
        let destino = this.destino;

        task(`cleanPlugin_${this.group}_${this.nombre}`, function () {
            return src(destino, { read: false, allowEmpty: true })
                .pipe(gulpClean({ force: true }))
        })

        return `cleanPlugin_${this.group}_${this.nombre}`;
    }

    // copy Task
    get copyTask() {
        this.copyFilesTask
        this.copyFoldersTask
        this.copyLanguagesTask
        this.copyManifestFile

        task(`copyPlugin_${this.group}_${this.nombre}`, series(...this.copyPlugin));

        return `copyPlugin_${this.group}_${this.nombre}`;
    }

    // release Task
    get releaseTask() {
        let desde = this.destino + '/**';
        let destino = this.releaseDest;
        let filename = this.zipFileName;

        task(`releasePlugin_${this.group}_${this.nombre}`, function (cb) {
            return src(desde)
                .pipe(GulpZip(filename))
                .pipe(dest(destino))
        })

        return `releasePlugin_${this.group}_${this.nombre}`;
    }

    get copyFilesTask() {
        let files = this.files;
        
        if (files.length > 0) {
            let destino = this.destino;
            task(`copyPluginFiles_${this.group}_${this.nombre}`, function() {
                return src(files, { allowEmpty: true })
                .pipe(dest(destino))
            })

            this.copyPlugin.push(`copyPluginFiles_${this.group}_${this.nombre}`);
        }        
    }

    get copyFoldersTask() {
        let folders = this.folders;
        
        if (folders.length > 0) {
            let destino = this.destino;
            let long = this.srcPathArrayLong;

            task(`copyPluginFolders_${this.group}_${this.nombre}`, function() {
                return src(folders, { allowEmpty: true })
                .pipe(gulpForeach(function (stream, file) {
                    let destFolderName = file.path.replace(/^\/+|\/+$/g, '').split('/')[long];
                    let destinoF = `${destino}${destFolderName}/`;
                    return stream
                    .pipe(dest(destinoF))
                }))
            })

            this.copyPlugin.push(`copyPluginFolders_${this.group}_${this.nombre}`);
        }        
    }

    get copyLanguagesTask() {
        let languages = this.languages;

        if (languages.length > 0) {
            let destino = this.languageDestino;

            task(`copyPluginLanguages_${this.group}_${this.nombre}`, function () {
                return src(languages, { allowEmpty: true })
                .pipe(gulpForeach(function (stream, file) {
                    let pathArray = file.path.split('/');
                    let longPathArray = pathArray.length;
                    let lang = pathArray[longPathArray - 2];
                    return stream
                    .pipe(dest(destino + lang + '/'))
                }))
            })

            this.copyPlugin.push(`copyPluginLanguages_${this.group}_${this.nombre}`);
        }        
    }

    get copyManifestFile() {
        let destino = this.destino
        let manifest = this.manifestFile;

        task(`copyPluginManifestFile_${this.group}_${this.nombre}`, function () {
            return src(manifest, { allowEmpty: true })
            .pipe(dest(destino))
        })
        this.copyPlugin.push(`copyPluginManifestFile_${this.group}_${this.nombre}`);
    }    
}

module.exports = Plugin
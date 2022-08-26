const capitalize = require('capitalize')
const { task, src, series, dest } = require('gulp')
const gulpClean = require('gulp-clean')
const gulpForeach = require('gulp-foreach')
const GulpZip = require('gulp-zip')
const { srcDir, destDir, releaseDir } = require('../config.json')
const Manifest = require('./Manifest')
const { limpiarRuta, getManisfestFiles, getManisfestFolders, getManifestLanguages } = require("./utils")

class Modulo {

    constructor(nombre, cliente = 'site') {
        let ruta = limpiarRuta(srcDir)
        this.rutaDesde = ruta
        nombre = nombre.toLowerCase()
        let nombreConMod = nombre.replace(/^mod_/g, '');
        this.nombreConMod = `mod_${nombreConMod}`;
        this.nombre = nombre
        this.cNombre = capitalize(nombre)
        cliente = cliente.toLowerCase()
        this.cliente = cliente == 'site' ? cliente : 'admin';
        let clienteDesde = this.cliente === 'site' ? '' : 'administrator/'

        let manifest = new Manifest(ruta, 'module', nombre, this.cliente)
        this.manifiesto = manifest.manifiesto;
        this.version = this.manifiesto.version

        this.client = this.manifiesto.$.client;
        this.rutaCompletaDesde = `${ruta}${clienteDesde}modules/${this.nombreConMod}/`
        this.rutaLanguageDesde = `${ruta}${clienteDesde}/language/`

        this.copyModule = [];

        let destino = destDir.charAt(destDir.length - 1) == '/' ? destDir : destDir + '/';
        this.destino = `${destino}modules/${this.cliente}/${this.nombre}/`;

        if (this.manifiesto.languages !== undefined) {
            let folder = this.manifiesto.languages[0].language[0]['_'].split('/')[0];
            this.languageFolder = folder
            this.languageDestino = `${this.destino}${folder}/`
        }

        let destinoRelease = releaseDir.charAt(releaseDir.length - 1) == '/' ? releaseDir : releaseDir + '/';
        this.releaseDest = `${destinoRelease}modules/${this.cliente}/${this.nombre}/`

        this.srcPathArrayLong = this.rutaCompletaDesde.replace(/^\/+|\/+$/g, '').split('/').length;
    }

    get files() {
        return getManisfestFiles(this.manifiesto.files, this.rutaCompletaDesde)
    }

    get folders() {
        return getManisfestFolders(this.manifiesto.files, this.rutaCompletaDesde)
    }

    get languages() {
        if (this.manifiesto.languages !== undefined) {
            return getManifestLanguages(this.manifiesto.languages, this.rutaLanguageDesde, this.languageFolder)
        }
    }

    get manifestFile() {
        return `${this.rutaCompletaDesde + this.nombreConMod}.xml`
    }

    get zipFileName() {
        return `mod_${this.cliente}_${this.nombre}.v${this.version}.zip`
    }

    //Tasks
    // clean Task
    get cleanTask() {
        let destino = this.destino

        task(`copyModule_${this.cliente}_${this.nombre}`, function () {
            return src(destino, { read: false, allowEmpty: true })
            .pipe(gulpClean({ force: true }))
        })

        return `copyModule_${this.cliente}_${this.nombre}`;
    }

    // copy Task
    get copyTask() {
        this.copyFilesTask
        this.copyFoldersTask
        this.copyLanguagesTask
        this.copyManifestFile

        task(`copyModule_${this.cliente}_${this.nombre}`, series(...this.copyModule));

        return `copyModule_${this.cliente}_${this.nombre}`;
    }

    // release Task
    get releaseTask() {
        let desde = this.destino + '**'
        let destino = this.releaseDest
        let filename = this.zipFileName

        task(`releaseModule_${this.cliente}_${this.nombre}`, function (cb) {
            return src(desde)
                .pipe(GulpZip(filename))
                .pipe(dest(destino))
        })

        return `releaseModule_${this.cliente}_${this.nombre}`;        
    }

    // Copy tasks
    get copyFilesTask() {
        let files = this.files;
        
        if (files.length > 0) {
            let destino = this.destino;
            task(`copyModuleFiles_${this.cliente}_${this.nombre}`, function() {
                return src(files, { allowEmpty: true })
                .pipe(dest(destino))
            })

            this.copyModule.push(`copyModuleFiles_${this.cliente}_${this.nombre}`);
        }        
    }

    get copyFoldersTask() {
        let folders = this.folders;
        
        if (folders.length > 0) {
            let destino = this.destino;
            let long = this.srcPathArrayLong;

            task(`copyModuleFolders_${this.cliente}_${this.nombre}`, function() {
                return src(folders, { allowEmpty: true })
                .pipe(gulpForeach(function (stream, file) {
                    let destFolderName = file.path.replace(/^\/+|\/+$/g, '').split('/')[long];
                    let destinoF = `${destino}${destFolderName}/`;
                    return stream
                    .pipe(dest(destinoF))
                }))
            })

            this.copyModule.push(`copyModuleFolders_${this.cliente}_${this.nombre}`);
        }        
    }

    get copyLanguagesTask() {
        let languages = this.languages;

        if (languages !== undefined && languages.length > 0) {
            let destino = this.languageDestino;

            task(`copyModuleLanguages_${this.cliente}_${this.nombre}`, function () {
                return src(languages, { allowEmpty: true })
                .pipe(gulpForeach(function (stream, file) {
                    let pathArray = file.path.split('/');
                    let longPathArray = pathArray.length;
                    let lang = pathArray[longPathArray - 2];
                    return stream
                    .pipe(dest(destino + lang + '/'))
                }))
            })

            this.copyModule.push(`copyModuleLanguages_${this.cliente}_${this.nombre}`);
        }        
    }

    get copyManifestFile() {
        let destino = this.destino
        let manifest = this.manifestFile;

        task(`copyModuleManifestFile_${this.cliente}_${this.nombre}`, function () {
            return src(manifest, { allowEmpty: true })
            .pipe(dest(destino))
        })
        this.copyModule.push(`copyModuleManifestFile_${this.cliente}_${this.nombre}`);
    }        
}

module.exports = Modulo
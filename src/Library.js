const Manifest = require("./Manifest");
const { limpiarRuta, getManisfestFiles, getManisfestFolders, getManifestLanguages } = require("./utils");
const { destDir, srcDir, releaseDir, backupDir } = require('../config.json');
const capitalize = require("capitalize");
const { task, src, dest } = require("gulp");
const clean = require('gulp-clean');
const GulpZip = require("gulp-zip");

class Library {
    
    constructor(nombre) {
        let ruta = limpiarRuta(srcDir);
        this.rutaDesde = ruta;
        nombre = nombre.toLowerCase();
        this.nombre = nombre;
        this.cNombre = capitalize(nombre);
        this.rutaCompleta = ruta + 'libraries/' + nombre + '/';

        let manifest = new Manifest(ruta, 'library', nombre);
        this.manifiesto = manifest.manifiesto;

        this.copyLibrary = [];

        let destinoRelease = releaseDir.charAt(releaseDir.length - 1) == '/' ? releaseDir : releaseDir + '/';
        this.releaseDest = destinoRelease + 'libaries/' + this.nombre + '/';

        this.srcPathsArray = this.rutaCompletaDesde.replace(/^\/+|\/+$/g, '').split('/').length;
        this.srcMediaPathArray = this.rutaMediaDesde.replace(/^\/+|\/+$/g, '').split('/').length;

    }

    get rutaCompletaDesde() {
        return this.rutaCompleta;
    }

    get rutaMediaDesde() {
        return this.rutaDesde + 'media/' + this.nombre + '/';
    }

    get rutaLanguagesDesde() {
        return this.rutaDesde + 'language/';
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
        return `${destDir}/libraries/${this.nombre}/`;
    }

    get destinoBackup() {
        backupDir.charAt(backupDir.length - 1) == '/' ? backupDir : backupDir + '/';
        return `${backupDir}/libraries/${this.nombre}/`;
    }

    get zipFileName() {
        return `lib_${this.nombre}.v${this.version}.zip`;
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

        task(`cleanLibrary${this.cNombre}`, function (cb) {
            return src(destino, {
                read: false,
                allowEmpty: true
            })
                .pipe(clean({ force: true }));
            cb();
        });

        return `cleanLibrary${this.cNombre}`;
    }

    get copyTask() {
        let origen = this.rutaCompletaDesde + '**/*.*';
        let destino = this.destino;

        task(`copyLibrary${this.cNombre}`, function (cb) {
            return src(origen, { allowEmpty: true })
                .pipe(dest(destino));
            cb();
        });

        return `copyLibrary${this.cNombre}`;
    }

    get backupTask() {
        let origen = this.rutaCompletaDesde + '**/*.*';
        let destino = this.destinoBackup;

        task(`backupLibrary${this.cNombre}`, function (cb) {
            return src(origen, { allowEmpty: true })
                .pipe(dest(destino));
            cb();
        });

        return `backupLibrary${this.cNombre}`;
    }

    get releaseTask() {
        let desde = this.destino + '/**';
        let destino = this.releaseDest;
        let filename = this.zipFileName;

        task(`releaseLibrary${this.cNombre}`, function(cb) {
            return src(desde)
                .pipe(GulpZip(filename))
                .pipe(dest(destino))
        })

        return `releaseLibrary${this.cNombre}`;
    }
}

module.exports = Library;